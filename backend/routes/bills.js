import express from 'express';
import { db } from '../storage/json-db.js';

const router = express.Router();

// Get all bills
router.get('/', (req, res) => {
  try {
    const bills = db.getAll('bills');
    res.json(bills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get bill by ID
router.get('/:id', (req, res) => {
  try {
    const bill = db.getById('bills', req.params.id);
    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }
    res.json(bill);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new bill
router.post('/', (req, res) => {
  try {
    const { id, clientId, amount, dueDate, status } = req.body;
    const newBill = db.create('bills', { id, clientId, amount, dueDate, status });
    res.status(201).json(newBill);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update bill
router.put('/:id', (req, res) => {
  try {
    const { clientId, amount, dueDate, status } = req.body;
    const updated = db.update('bills', req.params.id, { clientId, amount, dueDate, status });

    if (!updated) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete bill
router.delete('/:id', (req, res) => {
  try {
    const deleted = db.delete('bills', req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    res.json({ message: 'Bill deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
