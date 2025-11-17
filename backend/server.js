import express from 'express';
import cors from 'cors';
import tasksRouter from './routes/tasks.js';
import clientsRouter from './routes/clients.js';
import billsRouter from './routes/bills.js';
import employeesRouter from './routes/employees.js';
import documentsRouter from './routes/documents.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tasks', tasksRouter);
app.use('/api/clients', clientsRouter);
app.use('/api/bills', billsRouter);
app.use('/api/employees', employeesRouter);
app.use('/api/documents', documentsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`Using JSON file storage at backend/data/database.json`);
});
