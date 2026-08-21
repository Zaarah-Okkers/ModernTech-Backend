# ModernTech-Backend

A modern HR management system backend API built with Express.js and MySQL. This backend provides comprehensive HR operations including employee management, payroll processing, leave management, attendance tracking, performance reviews, and reporting.

## Overview

ModernTech-Backend is a Node.js/Express API server that handles all backend operations for an HR management platform. It uses MySQL for data persistence and includes authentication, role-based access control, and multiple business modules.

## Tech Stack

- **Runtime:** Node.js (ES modules)
- **Framework:** Express.js 5.2.1
- **Database:** MySQL 2 (mysql2)
- **Authentication:** JWT (jsonwebtoken)
- **Password Security:** bcryptjs
- **CORS:** Enabled for frontend integration
- **Environment:** dotenv for configuration

## Project Structure

```
ModernTech-Backend/
├── config/                 # Configuration files
│   └── database.js        # MySQL database connection setup
├── controllers/           # Request handlers (business logic)
├── middleware/            # Custom middleware (auth, validation)
├── models/                # Database models and queries
├── routes/                # API endpoint definitions
│   ├── auth.js           # Authentication routes (login, register)
│   ├── employees.js      # Employee management routes
│   ├── dashboard.js      # Dashboard data routes
│   ├── payroll.js        # Payroll processing routes
│   ├── leave.js          # Leave management routes
│   ├── attendance.js     # Attendance tracking routes
│   ├── performanceRoutes.js  # Performance review routes
│   ├── reportsRoutes.js  # Reporting routes
│   └── settingsRoutes.js # Settings management routes
├── utils/                 # Utility functions
├── server.js             # Main Express app server
├── index.js              # Alternative entry point
├── package.json          # Dependencies and scripts
└── mysql.sql             # Database schema and SQL setup
```

## Installation & Setup

### Prerequisites
- Node.js (14+)
- MySQL Server
- npm

### Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   Create a `.env` file in the project root:
   ```
   PORT=4000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=hrflow_db
   JWT_SECRET=your_secret_key
   ```

3. **Setup Database**
   - Create a MySQL database
   - Run the SQL schema:
   ```bash
   mysql -u root -p your_database < mysql.sql
   ```

4. **Start the Server**
   ```bash
   npm run dev      # Development mode (with nodemon)
   npm start        # Production mode
   ```

   Server runs on `http://localhost:4000`

## API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - User login with credentials
- JWT token-based authentication for secured routes

### Employee Management (`/api/employees`)
- `GET /api/employees` - List all employees
- `GET /api/employees/:id` - Get employee details
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee info
- `DELETE /api/employees/:id` - Delete employee

### Dashboard (`/api/dashboard`)
- `GET /api/dashboard` - Get dashboard statistics and summary data

### Payroll (`/api/payroll`)
- Process salary payments
- Generate payroll reports
- Manage payroll periods

### Leave Management (`/api/leave`)
- `GET /api/leave` - View leave requests
- `POST /api/leave` - Submit leave request
- `PUT /api/leave/:id` - Update leave status
- Manage leave balances and policies

### Attendance (`/api/attendance`)
- Track employee attendance
- Record check-in/check-out times
- Generate attendance reports

### Performance (`/api/performance`)
- Manage performance reviews
- Track employee ratings
- Store feedback and evaluations

### Reports (`/api/reports`)
- Generate various HR reports
- Export data in multiple formats
- Analytics and insights

### Settings (`/api/settings`)
- System configuration
- User preferences
- Organization settings

### Health Check (`/api/health`)
- `GET /api/health` - Server status endpoint

## Database (SQL)

This project includes **SQL** for database operations. The `mysql.sql` file contains:
- Complete database schema
- Table definitions for employees, users, payroll, leaves, attendance, etc.
- Indexes and relationships
- Sample data (optional)

Run it during initial setup to initialize your database structure.

## Security Features

- **Password Hashing:** bcryptjs for secure password storage
- **JWT Authentication:** Token-based session management
- **CORS Protection:** Restricted origin access
- **Input Validation:** Middleware for request validation
- **Error Handling:** Centralized error management

## Scripts

```bash
npm start          # Start server (production)
npm run dev        # Start with nodemon (development)
npm test           # Run tests
```

## Environment Configuration

The application uses `dotenv` to manage environment variables. Key configurations:

- `PORT` - Server port (default: 4000)
- `DB_HOST` - MySQL host
- `DB_USER` - MySQL username
- `DB_PASSWORD` - MySQL password
- `DB_NAME` - Database name
- `JWT_SECRET` - Secret key for JWT signing
- CORS origins for frontend URLs

## Frontend Integration

The API is configured to accept requests from:
- `http://localhost:4000`
- `http://127.0.0.1:5500`
- `http://localhost:5500`
- `https://hrflow-xg3y.onrender.com`

Add your frontend URL to the CORS configuration in `server.js` if needed.

## Error Handling

The server includes:
- 404 handler for undefined routes
- Global error handler for exceptions
- Comprehensive logging of errors
- Structured error responses

## Development Workflow

1. Make changes to controllers, routes, or models
2. Server auto-reloads with nodemon (dev mode)
3. Test endpoints with curl, Postman, or your frontend
4. Check database integrity in MySQL

## Troubleshooting

**Database Connection Error:**
- Verify MySQL is running
- Check `.env` credentials
- Ensure database exists

**Port Already in Use:**
- Change PORT in `.env`
- Or kill process: `lsof -i :4000` then `kill -9 <PID>`

**Module Not Found:**
- Run `npm install`
- Check import paths use `.js` extension

## License

See repository for license details.

## Support

For issues or questions, open an issue on the GitHub repository.
