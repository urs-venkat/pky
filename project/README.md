# Staffing Management System

A complete staffing management system with role-based access control for Admin, Company, Supervisor, and Employee.

## Features

### Main Admin
- Register and manage companies
- Enable/disable company accounts
- View platform statistics
- Manage admin profile

### Company Account
- Register employees and supervisors
- Define salary structures
- View attendance records
- Generate salary and payslips
- Manage company profile

### Supervisor
- View assigned employees
- Mark daily attendance
- Update attendance records
- View attendance history

### Employee
- View personal attendance
- View salary and payslips
- View documents
- Update profile information

## Technology Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

### Frontend
- React (JSX)
- React Router
- Axios
- Vite

## Project Structure

```
staffing-management/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── companyController.js
│   │   ├── attendanceController.js
│   │   └── salaryController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Company.js
│   │   ├── Attendance.js
│   │   └── Salary.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── admin.js
│   │   ├── company.js
│   │   ├── attendance.js
│   │   └── salary.js
│   ├── scripts/
│   │   └── createAdmin.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   └── Profile.jsx
│   │   │   ├── company/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   └── Profile.jsx
│   │   │   ├── supervisor/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   └── Profile.jsx
│   │   │   ├── employee/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   └── Profile.jsx
│   │   │   └── Login.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file from the example:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/staffing_management
JWT_SECRET=your_secure_jwt_secret_key
NODE_ENV=development
```

5. Create the first admin user:
```bash
node scripts/createAdmin.js
```

This will create an admin user with:
- Email: admin@staffing.com
- Password: admin123

6. Start the backend server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file from the example:
```bash
cp .env.example .env
```

4. Update the `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

5. Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Usage

### First Time Setup

1. Start MongoDB service
2. Start the backend server
3. Create the admin user using the script
4. Start the frontend application
5. Login with admin credentials

### Default Admin Credentials
- Email: admin@staffing.com
- Password: admin123

**Important:** Change the admin password after first login!

### Workflow

1. **Admin** registers companies
2. **Company** logs in and:
   - Registers supervisors
   - Registers employees with salary structures
   - Uploads employee documents
3. **Supervisor** logs in and:
   - Marks daily attendance for employees
4. **Company** generates salaries based on attendance
5. **Employee** logs in and:
   - Views attendance records
   - Views salary slips
   - Updates profile information

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/change-password` - Change password

### Admin
- `POST /api/admin/companies` - Register company
- `GET /api/admin/companies` - Get all companies
- `PATCH /api/admin/companies/:id/toggle` - Enable/disable company
- `GET /api/admin/stats` - Get platform statistics

### Company
- `POST /api/company/employees` - Register employee
- `GET /api/company/employees` - Get all employees
- `PUT /api/company/employees/:id` - Update employee
- `POST /api/company/supervisors` - Register supervisor
- `GET /api/company/supervisors` - Get all supervisors
- `GET /api/company/attendance` - Get attendance summary

### Attendance
- `POST /api/attendance` - Mark attendance
- `GET /api/attendance/employees` - Get employees for attendance
- `GET /api/attendance/today` - Get today's attendance
- `GET /api/attendance/employee/:id` - Get employee attendance

### Salary
- `POST /api/salary/generate` - Generate salary
- `GET /api/salary/all` - Get all salaries
- `GET /api/salary/employee/:id` - Get employee salary
- `GET /api/salary/my-payslips` - Get employee payslips

## Salary Calculation Formula

```
PerDaySalary = GrossSalary / TotalWorkingDays
DaysWorked = PresentDays + PaidLeaves + (HalfDays × 0.5)
MonthlyEarnings = PerDaySalary × DaysWorked
Deductions = PF + ESI
NetSalary = MonthlyEarnings - Deductions
```

## Production Deployment

### Backend

1. Set `NODE_ENV=production` in `.env`
2. Use a strong JWT secret
3. Configure MongoDB Atlas for cloud database
4. Deploy to services like:
   - Heroku
   - AWS EC2
   - DigitalOcean
   - Railway
   - Render

### Frontend

1. Build the production bundle:
```bash
npm run build
```

2. Deploy the `dist` folder to:
   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - GitHub Pages

3. Update `VITE_API_URL` to point to production backend

## Security Notes

- Always use HTTPS in production
- Change default admin password immediately
- Use strong JWT secrets
- Implement rate limiting for API endpoints
- Validate all user inputs
- Never commit `.env` files
- Use environment-specific configurations
- Implement proper error handling
- Log security events

## Support

For issues or questions, please contact the development team.

## License

Private - All rights reserved
