import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_DIR = path.join(__dirname, '../data');
const DB_FILE = path.join(DB_DIR, 'database.json');

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Initialize database with default data if it doesn't exist
function initDatabase() {
  if (!fs.existsSync(DB_FILE)) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const formatDate = (date) => date.toISOString().split('T')[0];

    const initialData = {
      clients: [
        { id: 'c1', name: 'Alice Johnson', address: 'Eichenweg 123', phone: '555-0101', email: 'alice@example.com' },
        { id: 'c2', name: 'Bob Williams', address: 'Kiefernstraße 456', phone: '555-0102', email: 'bob@example.com' },
        { id: 'c3', name: 'Charlie Brown', address: 'Ahorn-Allee 789', phone: '555-0103', email: 'charlie@example.com' },
        { id: 'c4', name: 'Diana Miller', address: 'Birken-Weg 101', phone: '555-0104', email: 'diana@example.com' },
      ],
      employees: [
        {
          id: 'e1',
          name: 'David Green',
          availability: { monday: true, tuesday: true, wednesday: true, thursday: true, friday: false, saturday: false, sunday: false }
        },
        {
          id: 'e2',
          name: 'Eve Gardener',
          availability: { monday: true, tuesday: true, wednesday: false, thursday: true, friday: true, saturday: false, sunday: false }
        },
        {
          id: 'e3',
          name: 'Frank Spade',
          availability: { monday: false, tuesday: false, wednesday: true, thursday: true, friday: true, saturday: true, sunday: false }
        },
        {
          id: 'e4',
          name: 'Grace Roots',
          availability: { monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: false, sunday: false }
        },
      ],
      tasks: [
        { id: 't1', title: 'Rasenmähen & Kantenschneiden', clientId: 'c1', assignedTo: ['e1', 'e4'], dueDate: formatDate(today), status: 'in-progress', description: "Standardmäßiges Mähen, Kanten an allen Gehwegen und der Einfahrt schneiden." },
        { id: 't2', title: 'Unkraut jäten in Beeten', clientId: 'c2', assignedTo: ['e2'], dueDate: formatDate(today), status: 'open', description: "Entfernen Sie alles Unkraut aus den vorderen und hinteren Gartenbeeten." },
        { id: 't3', title: 'Rosensträucher beschneiden', clientId: 'c1', assignedTo: ['e2'], dueDate: formatDate(tomorrow), status: 'open', description: "Sorgfältiger Schnitt aller 15 Rosensträucher." },
        { id: 't4', title: 'Sprinkleranlage installieren', clientId: 'c3', assignedTo: ['e1', 'e3'], dueDate: formatDate(nextWeek), status: 'open', description: "Vollständige Installation einer 5-Zonen-Sprinkleranlage." },
        { id: 't5', title: 'Blumenbeete mulchen', clientId: 'c4', assignedTo: ['e4'], dueDate: formatDate(tomorrow), status: 'in-progress', description: "5 cm dunkelbraunen Mulch auf alle Blumenbeete auftragen." },
        { id: 't6', title: 'Vierteljährliche Düngung', clientId: 'c2', assignedTo: ['e1'], dueDate: formatDate(yesterday), status: 'completed', description: "Ausgewogenen Dünger auf alle Rasenflächen auftragen." },
        { id: 't7', title: 'Herbst-Aufräumarbeiten', clientId: 'c3', assignedTo: ['e1', 'e4'], dueDate: formatDate(today), status: 'open', description: "Laub harken, Schmutz entfernen und auf den Winter vorbereiten." },
        { id: 't8', title: 'Neue einjährige Pflanzen setzen', clientId: 'c4', assignedTo: ['e2'], dueDate: formatDate(yesterday), status: 'completed', description: "Bunte einjährige Pflanzen am vorderen Gehweg pflanzen." },
      ],
      bills: [
        { id: 'b1', clientId: 'c1', amount: 150.00, dueDate: formatDate(nextWeek), status: 'due' },
        { id: 'b2', clientId: 'c2', amount: 75.00, dueDate: formatDate(yesterday), status: 'paid' },
        { id: 'b3', clientId: 'c3', amount: 1200.00, dueDate: formatDate(today), status: 'due' },
        { id: 'b4', clientId: 'c4', amount: 250.00, dueDate: '2023-12-15', status: 'overdue' },
        { id: 'b5', clientId: 'c2', amount: 75.00, dueDate: '2023-11-20', status: 'paid' },
      ],
      documents: []
    };

    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
    console.log('Database initialized with sample data');
  }
}

// Read database
function readDB() {
  initDatabase();
  const data = fs.readFileSync(DB_FILE, 'utf8');
  return JSON.parse(data);
}

// Write database
function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Generic CRUD operations
export const db = {
  // Get all items from a collection
  getAll(collection) {
    const data = readDB();
    return data[collection] || [];
  },

  // Get item by ID
  getById(collection, id) {
    const data = readDB();
    return data[collection]?.find(item => item.id === id);
  },

  // Create new item
  create(collection, item) {
    const data = readDB();
    if (!data[collection]) {
      data[collection] = [];
    }
    data[collection].push(item);
    writeDB(data);
    return item;
  },

  // Update item
  update(collection, id, updates) {
    const data = readDB();
    const index = data[collection]?.findIndex(item => item.id === id);

    if (index === -1 || index === undefined) {
      return null;
    }

    data[collection][index] = { ...data[collection][index], ...updates };
    writeDB(data);
    return data[collection][index];
  },

  // Delete item
  delete(collection, id) {
    const data = readDB();
    const index = data[collection]?.findIndex(item => item.id === id);

    if (index === -1 || index === undefined) {
      return false;
    }

    data[collection].splice(index, 1);
    writeDB(data);
    return true;
  }
};

// Initialize on module load
initDatabase();
