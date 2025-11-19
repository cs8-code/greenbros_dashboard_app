import express from 'express';
import { db } from '../storage/json-db.js';

const router = express.Router();

// GET all emails
router.get('/', (req, res) => {
  try {
    const emails = db.getAll('emails');
    res.json(emails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET email by ID
router.get('/:id', (req, res) => {
  try {
    const email = db.getById('emails', req.params.id);
    if (!email) {
      return res.status(404).json({ error: 'Email not found' });
    }
    res.json(email);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new email (manual import)
router.post('/', (req, res) => {
  try {
    const { from, subject, content, keywords, attachments } = req.body;

    const newEmail = {
      id: `em${Date.now()}`,
      from,
      subject,
      content,
      receivedDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'unread',
      keywords: keywords || [],
      attachments: attachments || []
    };

    db.create('emails', newEmail);
    res.status(201).json(newEmail);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH update email status
router.patch('/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    const updated = db.update('emails', req.params.id, { status });

    if (!updated) {
      return res.status(404).json({ error: 'Email not found' });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE email
router.delete('/:id', (req, res) => {
  try {
    const deleted = db.delete('emails', req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Email not found' });
    }

    res.json({ message: 'Email deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
