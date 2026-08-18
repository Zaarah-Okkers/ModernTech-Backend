import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import employeeRoutes from './routes/employees.js';
import dashboardRoutes from './routes/dashboard.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/employees', employeeRoutes);
app.use('/api/dashboard', dashboardRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});