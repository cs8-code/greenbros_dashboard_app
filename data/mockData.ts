import { Task, Client, Bill, Employee } from '../types';

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const nextWeek = new Date(today);
nextWeek.setDate(today.getDate() + 7);

const formatDate = (date: Date) => date.toISOString().split('T')[0];

export const MOCK_CLIENTS: Client[] = [
  { id: 'c1', name: 'Alice Johnson', address: 'Eichenweg 123', phone: '555-0101', email: 'alice@example.com' },
  { id: 'c2', name: 'Bob Williams', address: 'Kiefernstraße 456', phone: '555-0102', email: 'bob@example.com' },
  { id: 'c3', name: 'Charlie Brown', address: 'Ahorn-Allee 789', phone: '555-0103', email: 'charlie@example.com' },
  { id: 'c4', name: 'Diana Miller', address: 'Birken-Weg 101', phone: '555-0104', email: 'diana@example.com' },
];

export const MOCK_EMPLOYEES: Employee[] = [
  { 
    id: 'e1', 
    name: 'David Green', 
    role: 'Chefgärtner', 
    avatarUrl: 'https://i.pravatar.cc/150?u=e1', 
    availability: { monday: true, tuesday: true, wednesday: true, thursday: true, friday: false, saturday: false, sunday: false } 
  },
  { 
    id: 'e2', 
    name: 'Eve Gardener', 
    role: 'Gartenbau-Expertin', 
    avatarUrl: 'https://i.pravatar.cc/150?u=e2', 
    availability: { monday: true, tuesday: true, wednesday: false, thursday: true, friday: true, saturday: false, sunday: false } 
  },
  { 
    id: 'e3', 
    name: 'Frank Spade', 
    role: 'Landschaftsgärtner', 
    avatarUrl: 'https://i.pravatar.cc/150?u=e3', 
    availability: { monday: false, tuesday: false, wednesday: true, thursday: true, friday: true, saturday: true, sunday: false }
  },
  { 
    id: 'e4', 
    name: 'Grace Roots', 
    role: 'Nachwuchs-Gärtnerin', 
    avatarUrl: 'https://i.pravatar.cc/150?u=e4', 
    availability: { monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: false, sunday: false }
  },
];

export const MOCK_TASKS: Task[] = [
  { id: 't1', title: 'Rasenmähen & Kantenschneiden', clientId: 'c1', assignedTo: ['e1', 'e4'], dueDate: formatDate(today), status: 'in-progress', description: "Standardmäßiges Mähen, Kanten an allen Gehwegen und der Einfahrt schneiden." },
  { id: 't2', title: 'Unkraut jäten in Beeten', clientId: 'c2', assignedTo: ['e2'], dueDate: formatDate(today), status: 'open', description: "Entfernen Sie alles Unkraut aus den vorderen und hinteren Gartenbeeten." },
  { id: 't3', title: 'Rosensträucher beschneiden', clientId: 'c1', assignedTo: ['e2'], dueDate: formatDate(tomorrow), status: 'open', description: "Sorgfältiger Schnitt aller 15 Rosensträucher." },
  { id: 't4', title: 'Sprinkleranlage installieren', clientId: 'c3', assignedTo: ['e1', 'e3'], dueDate: formatDate(nextWeek), status: 'open', description: "Vollständige Installation einer 5-Zonen-Sprinkleranlage." },
  { id: 't5', title: 'Blumenbeete mulchen', clientId: 'c4', assignedTo: ['e4'], dueDate: formatDate(tomorrow), status: 'in-progress', description: "5 cm dunkelbraunen Mulch auf alle Blumenbeete auftragen." },
  { id: 't6', title: 'Vierteljährliche Düngung', clientId: 'c2', assignedTo: ['e1'], dueDate: formatDate(yesterday), status: 'completed', description: "Ausgewogenen Dünger auf alle Rasenflächen auftragen." },
  { id: 't7', title: 'Herbst-Aufräumarbeiten', clientId: 'c3', assignedTo: ['e1', 'e4'], dueDate: formatDate(today), status: 'open', description: "Laub harken, Schmutz entfernen und auf den Winter vorbereiten." },
  { id: 't8', title: 'Neue einjährige Pflanzen setzen', clientId: 'c4', assignedTo: ['e2'], dueDate: formatDate(yesterday), status: 'completed', description: "Bunte einjährige Pflanzen am vorderen Gehweg pflanzen." },
];

export const MOCK_BILLS: Bill[] = [
  { id: 'b1', clientId: 'c1', amount: 150.00, dueDate: formatDate(nextWeek), status: 'due' },
  { id: 'b2', clientId: 'c2', amount: 75.00, dueDate: formatDate(yesterday), status: 'paid' },
  { id: 'b3', clientId: 'c3', amount: 1200.00, dueDate: formatDate(today), status: 'due' },
  { id: 'b4', clientId: 'c4', amount: 250.00, dueDate: new Date(2023, 11, 15).toISOString().split('T')[0], status: 'overdue' },
  { id: 'b5', clientId: 'c2', amount: 75.00, dueDate: new Date(2023, 10, 20).toISOString().split('T')[0], status: 'paid' },
];