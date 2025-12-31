import express from 'express';
import { db } from '../storage/json-db.js';
import { analyzeEmail } from '../services/ai-analyzer.js';
import { fetchNewEmails } from '../services/email-fetcher.js';

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

// POST create new email (manual import or sent email)
router.post('/', (req, res) => {
  try {
    const { from, to, subject, content, keywords, attachments, type } = req.body;

    // Validate required fields
    if (!subject || !content) {
      return res.status(400).json({ error: 'Subject and content are required' });
    }

    // Determine email type (default to 'received' for backward compatibility)
    const emailType = type || 'received';

    // Validate recipient for sent emails
    if (emailType === 'sent' && !to) {
      return res.status(400).json({ error: 'Recipient (to) is required for sent emails' });
    }

    const newEmail = {
      id: `em${Date.now()}`,
      type: emailType,
      from: from || 'office@greenbros.de',
      to: to || undefined,
      subject,
      content,
      receivedDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: emailType === 'sent' ? 'read' : 'unread',
      keywords: keywords || [],
      attachments: attachments || []
    };

    db.create('emails', newEmail);
    res.status(201).json(newEmail);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update email (full update)
router.put('/:id', (req, res) => {
  try {
    const updated = db.update('emails', req.params.id, req.body);

    if (!updated) {
      return res.status(404).json({ error: 'Email not found' });
    }

    res.json(updated);
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

// POST analyze email with AI
router.post('/:id/analyze', async (req, res) => {
  try {
    const email = db.getById('emails', req.params.id);
    if (!email) {
      return res.status(404).json({ error: 'Email not found' });
    }

    const clients = db.getAll('clients');
    const analysis = await analyzeEmail(email.content, email.subject, clients);

    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing email:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST fetch new emails from Gmail
router.post('/fetch', async (req, res) => {
  try {
    console.log('Fetching new emails from Gmail...');
    const newEmails = await fetchNewEmails();

    // Check for duplicates and save each email to database
    const existingEmails = db.getAll('emails');
    const savedEmails = [];

    for (const emailData of newEmails) {
      // Check if email already exists (simple duplicate detection)
      const isDuplicate = existingEmails.some(e =>
        e.from === emailData.from &&
        e.subject === emailData.subject &&
        Math.abs(new Date(e.receivedDate) - new Date()) < 60000 // Within 1 minute
      );

      if (!isDuplicate) {
        const newEmail = {
          id: `em${Date.now()}${Math.floor(Math.random() * 1000)}`,
          type: emailData.type,
          from: emailData.from,
          subject: emailData.subject,
          content: emailData.content,
          receivedDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
          status: emailData.status,
          keywords: emailData.keywords,
          attachments: []
        };

        db.create('emails', newEmail);
        savedEmails.push(newEmail);
      }
    }

    console.log(`Saved ${savedEmails.length} new email(s) to database`);

    res.json({
      success: true,
      count: savedEmails.length,
      emails: savedEmails
    });
  } catch (error) {
    console.error('Error fetching emails:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
