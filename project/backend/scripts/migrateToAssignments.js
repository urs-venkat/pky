require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Assignment = require('../models/Assignment');

const migrateToAssignments = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to MongoDB');

    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.error('Admin user not found!');
      process.exit(1);
    }

    console.log('Starting migration...');

    const employees = await User.find({
      role: 'employee',
      companyId: { $exists: true, $ne: null }
    });

    console.log(`Found ${employees.length} employees to migrate`);

    let migratedCount = 0;
    let skippedCount = 0;

    for (const employee of employees) {
      const existingAssignment = await Assignment.findOne({
        employeeId: employee._id,
        companyId: employee.companyId,
        status: 'active'
      });

      if (existingAssignment) {
        console.log(`Skipping ${employee.name} - already has active assignment`);
        skippedCount++;
        continue;
      }

      let dailySalary = 1000;
      if (employee.salaryStructure && employee.salaryStructure.grossSalary) {
        dailySalary = Math.round(employee.salaryStructure.grossSalary / 26);
      } else if (employee.salaryStructure && employee.salaryStructure.basicSalary) {
        const gross = employee.salaryStructure.basicSalary +
          (employee.salaryStructure.hra || 0) +
          (employee.salaryStructure.allowances || 0);
        dailySalary = Math.round(gross / 26);
      }

      const startDate = employee.createdAt || new Date();
      const endDate = new Date(startDate);
      endDate.setFullYear(endDate.getFullYear() + 1);

      const assignment = new Assignment({
        employeeId: employee._id,
        companyId: employee.companyId,
        startDate: startDate,
        endDate: endDate,
        dailySalary: dailySalary,
        status: 'active',
        notes: 'Migrated from old system',
        assignedBy: admin._id
      });

      await assignment.save();

      console.log(`✓ Created assignment for ${employee.name} (Daily: ₹${dailySalary})`);
      migratedCount++;
    }

    const supervisors = await User.find({ role: 'supervisor' });
    console.log(`\nFound ${supervisors.length} supervisors`);

    for (const supervisor of supervisors) {
      if (supervisor.companyId) {
        supervisor.companyId = undefined;
        supervisor.companyCode = undefined;
        await supervisor.save();
        console.log(`✓ Freed supervisor ${supervisor.name}`);
      }
    }

    console.log('\n=== Migration Summary ===');
    console.log(`Employees migrated: ${migratedCount}`);
    console.log(`Employees skipped: ${skippedCount}`);
    console.log(`Supervisors freed: ${supervisors.length}`);
    console.log('\nMigration completed successfully!');

    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
};

migrateToAssignments();
