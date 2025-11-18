import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { db } from '../storage/json-db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
fs.mkdir(uploadsDir, { recursive: true }).catch(err => {
  console.error('Error creating uploads directory:', err);
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// GET all documents
router.get('/', (req, res) => {
  try {
    const documents = db.getAll('documents');
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read documents' });
  }
});

// POST upload a new document
router.post('/', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { type } = req.body;

    if (!type || !['Rechnung', 'Vertrag', 'Sonstiges'].includes(type)) {
      return res.status(400).json({ error: 'Invalid document type' });
    }

    const newDocument = {
      id: 'd' + Date.now(),
      name: req.file.originalname,
      type: type,
      uploadDate: new Date().toISOString().split('T')[0],
      filePath: req.file.filename,
      fileSize: req.file.size
    };

    db.create('documents', newDocument);

    res.status(201).json(newDocument);
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ error: 'Failed to upload document' });
  }
});

// DELETE a document
router.delete('/:id', async (req, res) => {
  try {
    const document = db.getById('documents', req.params.id);

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Delete the file from filesystem
    try {
      const filePath = path.join(uploadsDir, document.filePath);
      await fs.unlink(filePath);
    } catch (err) {
      console.error('Error deleting file:', err);
      // Continue even if file deletion fails
    }

    // Remove from database
    db.delete('documents', req.params.id);

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

// GET download a document
router.get('/:id/download', (req, res) => {
  try {
    const document = db.getById('documents', req.params.id);

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const filePath = path.join(uploadsDir, document.filePath);
    res.download(filePath, document.name);
  } catch (error) {
    console.error('Error downloading document:', error);
    res.status(500).json({ error: 'Failed to download document' });
  }
});

export default router;
