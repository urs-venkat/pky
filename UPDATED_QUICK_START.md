# Quick Start Guide - Updated System

## New Workflow

### 1. Admin Setup

**Step 1: Register Company**
```
POST /api/admin/companies
{
  "name": "Tech Solutions",
  "email": "tech@solutions.com",
  "password": "tech123",
  "phone": "9876543210",
  "address": "Company Address",
  "gstNumber": "27AABCT1234F1Z5"
}
```

**Step 2: Register Employees**
```
POST /api/admin/employees
{
  "name": "John Employee",
  "email": "john@employee.com",
  "password": "john123",
  "phone": "9876543210",
  "address": "Employee Address",
  "aadhaar": "123456789012",
  "pan": "ABCDE1234F",
  "bankDetails": {
    "accountNumber": "1234567890",
    "ifscCode": "ABCD0001234",
    "bankName": "Test Bank",
    "accountHolderName": "John Employee"
  },
  "salaryStructure": {
    "basicSalary": 30000,
    "hra": 10000,
    "allowances": 5000
  }
}
```

**Step 3: Register Supervisors**
```
POST /api/admin/supervisors
{
  "name": "Sarah Supervisor",
  "email": "sarah@supervisor.com",
  "password": "sarah123",
  "phone": "9876543210",
  "address": "Supervisor Address"
}
```

**Step 4: Create Assignment**
```
POST /api/assignments
{
  "employeeId": "employee_id_here",
  "companyId": "company_id_here",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "dailySalary": 1500,
  "notes": "Initial assignment"
}
```

### 2. Company Usage

**View Assigned Employees**
```
GET /api/company/employees
```

Response:
```json
[
  {
    "_id": "employee_id",
    "name": "John Employee",
    "email": "john@employee.com",
    "assignmentId": "assignment_id",
    "dailySalary": 1500,
    "startDate": "2024-01-01",
    "endDate": "2024-12-31"
  }
]
```

**View All Assignments**
```
GET /api/company/assignments?status=active
```

**Generate Salary**
```
POST /api/salary/generate
{
  "employeeId": "employee_id",
  "assignmentId": "assignment_id",
  "month": 1,
  "year": 2024
}
```

### 3. Supervisor Usage

**Get Companies to Work With**
```
GET /api/attendance/companies
```

Response:
```json
[
  {
    "_id": "company_id",
    "name": "Tech Solutions",
    "companyCode": "COMP123"
  }
]
```

**Get Employees for Selected Company**
```
GET /api/attendance/employees?companyId=company_id
```

**Mark Attendance**
```
POST /api/attendance
{
  "employeeId": "employee_id",
  "companyId": "company_id",
  "date": "2024-01-15",
  "status": "Present",
  "checkInTime": "09:00",
  "checkOutTime": "18:00",
  "remarks": "On time"
}
```

### 4. Employee Usage

**View Attendance**
```
GET /api/attendance/employee/employee_id?month=1&year=2024
```

**View Payslips**
```
GET /api/salary/my-payslips
```

## Testing Scenario

### Complete Test Flow

1. **Admin Creates Resources**
   - Login as admin (admin@staffing.com / admin123)
   - Register company "Tech Corp"
   - Register employee "Mike Worker"
   - Register supervisor "Jane Manager"

2. **Admin Creates Assignment**
   - Assign Mike to Tech Corp
   - Start: Today
   - End: 30 days from today
   - Daily salary: 1500

3. **Company Views Employee**
   - Login as Tech Corp
   - See Mike in employee list
   - View assignment details

4. **Supervisor Marks Attendance**
   - Login as Jane
   - Select Tech Corp from company list
   - See Mike in employee list
   - Mark attendance for today

5. **Company Generates Salary**
   - Login as Tech Corp
   - Select Mike
   - Select assignment
   - Generate for current month
   - Salary = days worked × 1500

6. **Employee Views Results**
   - Login as Mike
   - View attendance records
   - View payslip

7. **Assignment Ends**
   - After 30 days, assignment auto-completes
   - Mike no longer shows in Tech Corp's employee list
   - Mike becomes "free" for new assignments
   - Admin can assign Mike to another company

## Key Differences from Old System

| Feature | Old System | New System |
|---------|-----------|------------|
| Employee Registration | Company | Admin |
| Supervisor Registration | Company | Admin |
| Employee-Company Relation | Permanent | Time-based |
| Salary Structure | Monthly complex | Daily simple |
| Attendance | Company-based | Assignment-based |
| Resource Pooling | No | Yes (free employees) |

## API Testing with cURL

### Register Employee
```bash
curl -X POST http://localhost:5000/api/admin/employees \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Employee",
    "email": "test@employee.com",
    "password": "test123",
    "phone": "9876543210",
    "salaryStructure": {
      "basicSalary": 30000
    }
  }'
```

### Create Assignment
```bash
curl -X POST http://localhost:5000/api/assignments \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "EMPLOYEE_ID",
    "companyId": "COMPANY_ID",
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "dailySalary": 1500
  }'
```

### Mark Attendance
```bash
curl -X POST http://localhost:5000/api/attendance \
  -H "Authorization: Bearer SUPERVISOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "EMPLOYEE_ID",
    "companyId": "COMPANY_ID",
    "date": "2024-01-15",
    "status": "Present",
    "checkInTime": "09:00",
    "checkOutTime": "18:00"
  }'
```

### Generate Salary
```bash
curl -X POST http://localhost:5000/api/salary/generate \
  -H "Authorization: Bearer COMPANY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "EMPLOYEE_ID",
    "assignmentId": "ASSIGNMENT_ID",
    "month": 1,
    "year": 2024
  }'
```

## Common Operations

### Check Free Employees
```bash
curl -X GET http://localhost:5000/api/assignments/free-employees \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### Auto-Complete Expired Assignments
```bash
curl -X GET http://localhost:5000/api/assignments/check-status \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### View Company's Active Employees
```bash
curl -X GET http://localhost:5000/api/company/employees \
  -H "Authorization: Bearer COMPANY_TOKEN"
```

## Frontend Integration Points

### Admin Dashboard Needs:
- Employee registration form
- Supervisor registration form
- Assignment creation form (with date pickers)
- Free employees list
- Active assignments table
- Assignment timeline/calendar view

### Company Dashboard Needs:
- Remove employee/supervisor registration
- Display assigned employees with dates
- Assignment history view
- Update salary generation (add assignmentId field)

### Supervisor Dashboard Needs:
- Company selection dropdown
- Dynamic employee list based on company
- Add companyId to attendance form

## Salary Calculation Example

**Assignment Details:**
- Daily Salary: ₹1500
- Month: January 2024 (31 days)

**Attendance:**
- Present: 22 days
- Half-day: 2 days
- Paid Leave: 1 day
- Absent: 6 days

**Calculation:**
```
Days Worked = 22 + (2 × 0.5) + 1 = 24 days
Total Earnings = 24 × 1500 = ₹36,000
```

## Tips

1. **Assignment Validation:** System validates employee is assigned to company on the attendance date
2. **Auto-Completion:** Run `/api/assignments/check-status` periodically to auto-complete expired assignments
3. **Free Pool:** Check free employees before hiring new ones
4. **History:** All assignment history is preserved
5. **Overlap Prevention:** System prevents overlapping assignments for same employee
