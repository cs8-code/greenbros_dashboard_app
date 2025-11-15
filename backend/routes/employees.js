import express from 'express';
import { db } from '../storage/json-db.js';

const router = express.Router();

// Get all employees
router.get('/', (req, res) => {
  try {
    const employees = db.getAll('employees');
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get employee by ID
router.get('/:id', (req, res) => {
  try {
    const employee = db.getById('employees', req.params.id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new employee
router.post('/', (req, res) => {
  try {
    const { id, name, availability } = req.body;
    const newEmployee = db.create('employees', { id, name, availability });
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update employee
router.put('/:id', (req, res) => {
  try {
    const { name, availability } = req.body;
    const updated = db.update('employees', req.params.id, { name, availability });

    if (!updated) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete employee
router.delete('/:id', (req, res) => {
  try {
    const deleted = db.delete('employees', req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
