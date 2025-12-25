# System Changes Documentation

## Overview

The Staffing Management System has been restructured to centralize employee and supervisor management under Admin control, with time-based company assignments and daily salary calculations.

## Key Changes

### 1. Employee Management

**Before:**
- Companies registered employees
- Employees were permanently tied to one company
- companyId was stored in User model

**After:**
- Admin registers all employees
- Employees are independent entities
- Employees can be assigned to different companies over time through Assignments
- No permanent company association

**New Endpoints:**
- `POST /api/admin/employees` - Register employee
- `GET /api/admin/employees` - Get all employees
- `PUT /api/admin/employees/:employeeId` - Update employee

### 2. Supervisor Management

**Before:**
- Companies created supervisors
- Supervisors belonged to one company

**After:**
- Admin creates all supervisors
- Supervisors are independent and work across companies
- Can mark attendance for any company's employees

**New Endpoints:**
- `POST /api/admin/supervisors` - Register supervisor
- `GET /api/admin/supervisors` - Get all supervisors

### 3. Assignment System

**New Feature:** Time-based employee-company assignments

**Assignment Model Fields:**
- employeeId - Employee assigned
- companyId - Company assigned to
- startDate - Assignment start date
- endDate - Assignment end date
- dailySalary - Daily wage for this assignment
- status - active, completed, cancelled
- assignedBy - Admin who created assignment

**Assignment Workflow:**
1. Admin assigns employee to company with time period
2. Employee shows up in company's employee list during assignment period
3. After end date, assignment automatically completes
4. Employee becomes "free" and available for new assignments

**New Endpoints:**
```
POST /api/assignments - Create assignment
GET /api/assignments - Get all assignments (Admin)
GET /api/assignments/free-employees - Get unassigned employees
GET /api/assignments/:id - Get assignment details
PUT /api/assignments/:id - Update assignment
PATCH /api/assignments/:id/complete - Complete assignment
GET /api/assignments/check-status - Auto-complete expired assignments
GET /api/assignments/company - Company's assignments
```

### 4. Company Portal Changes

**Before:**
- Register employees/supervisors
- View all employees permanently

**After:**
- View only currently assigned employees
- See assignment time periods
- View assignment history
- All employees show start/end dates

**Updated Endpoints:**
```
GET /api/company/employees - Get currently assigned employees
GET /api/company/employees/:id - View employee details
GET /api/company/assignments - View all assignments (active/completed)
GET /api/company/supervisors - View all supervisors
```

### 5. Attendance System

**Changes:**
- Supervisors select company first, then see employees
- Validates employee is assigned to company on attendance date
- Attendance requires companyId in request
- Supervisors can work with multiple companies

**Updated Endpoints:**
```
GET /api/attendance/companies - Get companies with active assignments
GET /api/attendance/employees?companyId=X - Get employees for company
POST /api/attendance - Mark attendance (requires companyId)
```

**Attendance Request:**
```json
{
  "employeeId": "xxx",
  "companyId": "yyy",
  "date": "2024-01-15",
  "status": "Present",
  "checkInTime": "09:00",
  "checkOutTime": "18:00",
  "remarks": "On time"
}
```

### 6. Salary System

**Before:**
- Monthly salary with complex calculations
- Basic + HRA + Allowances
- PF/ESI deductions

**After:**
- Daily salary system
- Simple calculation: dailyRate × daysWorked
- Based on assignment daily rate

**Updated Model:**
```javascript
{
  employeeId,
  companyId,
  assignmentId,
  month, year,
  presentDays, halfDays, paidLeaves, absentDays,
  dailySalary,
  daysWorked,
  totalEarnings,
  status
}
```

**Salary Calculation:**
```
daysWorked = presentDays + paidLeaves + (halfDays × 0.5)
totalEarnings = dailySalary × daysWorked
```

**Updated Endpoint:**
```
POST /api/salary/generate
Body: {
  employeeId,
  assignmentId,
  month,
  year
}
```

## Database Models

### New: Assignment Model
```javascript
{
  employeeId: ObjectId,
  companyId: ObjectId,
  startDate: Date,
  endDate: Date,
  dailySalary: Number,
  status: 'active' | 'completed' | 'cancelled',
  notes: String,
  assignedBy: ObjectId
}
```

### Updated: Salary Model
```javascript
{
  employeeId: ObjectId,
  companyId: ObjectId,
  assignmentId: ObjectId,
  month: Number,
  year: Number,
  presentDays: Number,
  halfDays: Number,
  paidLeaves: Number,
  absentDays: Number,
  daysWorked: Number,
  dailySalary: Number,
  totalEarnings: Number,
  status: String
}
```

### Updated: User Model
- Removed permanent companyId association
- Removed companyCode for employees/supervisors
- Kept salaryStructure for reference (optional)

## Admin Workflow

1. **Setup:**
   - Register companies
   - Register employees
   - Register supervisors

2. **Assignment:**
   - Select employee from free pool
   - Choose company
   - Set start and end dates
   - Set daily salary rate
   - Create assignment

3. **Monitor:**
   - View all active assignments
   - See assignment history
   - Check free employees
   - Auto-complete expired assignments

## Company Workflow

1. **View Assigned Employees:**
   - See currently assigned employees only
   - View assignment periods
   - Check employee details

2. **Attendance:**
   - Company can view attendance for assigned employees
   - Historical data preserved

3. **Salary:**
   - Generate salary for assigned employees
   - Based on daily rate from assignment
   - Calculate from attendance records

## Supervisor Workflow

1. **Select Company:**
   - View all companies with active assignments
   - Select company to work with

2. **Mark Attendance:**
   - See employees assigned to selected company
   - Mark attendance with company context
   - System validates assignment

## Employee Experience

- View own attendance across all assignments
- See payslips from different companies
- Profile shows basic info (no company tie)
- Assignment history tracked

## Migration Notes

### For Existing Data:

1. **Employees with companyId:**
   - Create assignment records for existing employees
   - Set reasonable start dates (e.g., creation date)
   - Set end dates (e.g., 1 year from now)
   - Calculate daily salary from existing salary structure

2. **Supervisors:**
   - Remove companyId association
   - Make them available to all companies

3. **Attendance Records:**
   - Already have companyId, no changes needed

4. **Salary Records:**
   - Old records remain for history
   - New records use new structure

## API Summary

### Admin APIs
- Companies: CRUD operations
- Employees: Register, view, update
- Supervisors: Register, view
- Assignments: Full management

### Company APIs
- View assigned employees
- View assignments
- View supervisors (all)
- Attendance summary
- Generate salary

### Supervisor APIs
- View companies
- View employees per company
- Mark attendance
- View attendance history

### Employee APIs
- View own attendance
- View payslips
- Update profile

## Frontend Updates Needed

### Admin Dashboard
- Add employee registration form
- Add supervisor registration form
- Add assignment management interface
- Show free employees list
- Assignment calendar/timeline view

### Company Dashboard
- Remove employee/supervisor registration
- Show assigned employees with dates
- Add assignment view
- Update salary generation (include assignmentId)

### Supervisor Dashboard
- Add company selection dropdown
- Update employee list per company
- Pass companyId in attendance

### Employee Dashboard
- No major changes
- Already shows attendance/salary across assignments

## Benefits

1. **Flexibility:** Employees can work for multiple companies over time
2. **Centralized Control:** Admin manages all resources
3. **Time Tracking:** Clear assignment periods
4. **Simple Salary:** Easy daily rate calculation
5. **Assignment History:** Complete record of all placements
6. **Resource Optimization:** See free employees easily
7. **Shared Resources:** Supervisors work across companies

## Security Considerations

- Assignments validated on attendance marking
- Companies can only see assigned employees
- Supervisors validated per company
- Assignment dates checked on all operations
- Historical data preserved and protected
