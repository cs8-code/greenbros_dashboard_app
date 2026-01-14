import express from 'express';
import { db } from '../storage/json-db.js';

const router = express.Router();

// Get all tasks
router.get('/', (req, res) => {
  try {
    const tasks = db.getAll('tasks');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get task by ID
router.get('/:id', (req, res) => {
  try {
    const task = db.getById('tasks', req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new task
router.post('/', (req, res) => {
  try {
    const { id, title, clientId, contactPerson, assignedTo, dueDate, status, description } = req.body;
    const newTask = db.create('tasks', { id, title, clientId, contactPerson, assignedTo, dueDate, status, description });
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update task
router.put('/:id', (req, res) => {
  try {
    const { title, clientId, contactPerson, assignedTo, dueDate, status, description } = req.body;
    const updated = db.update('tasks', req.params.id, { title, clientId, contactPerson, assignedTo, dueDate, status, description });

    if (!updated) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update task status only
router.patch('/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    const updated = db.update('tasks', req.params.id, { status });

    if (!updated) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete task
router.delete('/:id', (req, res) => {
  try {
    const deleted = db.delete('tasks', req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
