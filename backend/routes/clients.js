import express from 'express';
import { db } from '../storage/json-db.js';

const router = express.Router();

// Get all clients
router.get('/', (req, res) => {
  try {
    const clients = db.getAll('clients');
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get client by ID
router.get('/:id', (req, res) => {
  try {
    const client = db.getById('clients', req.params.id);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new client
router.post('/', (req, res) => {
  try {
    const { id, name, address, phone, email } = req.body;
    const newClient = db.create('clients', { id, name, address, phone, email });
    res.status(201).json(newClient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update client
router.put('/:id', (req, res) => {
  try {
    const { name, address, phone, email } = req.body;
    const updated = db.update('clients', req.params.id, { name, address, phone, email });

    if (!updated) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete client
router.delete('/:id', (req, res) => {
  try {
    const deleted = db.delete('clients', req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
