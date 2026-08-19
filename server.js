import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import employeeRoutes from './routes/employees.js';
import dashboardRoutes from './routes/dashboard.js';
import payrollRoutes from './routes/payroll.js';
import leaveRoutes from './routes/leave.js';
import attendanceRoutes from './routes/attendance.js';
import settingsRoutes from './routes/settings.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/employees', employeeRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/settings', settingsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});