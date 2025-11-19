export type TaskStatus = 'open' | 'in-progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  clientId: string;
  assignedTo: string[];
  dueDate: string; // YYYY-MM-DD
  status: TaskStatus;
  description: string;
}

export interface Client {
  id: string;
  name: string;
  address: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
}

export type BillStatus = 'paid' | 'due' | 'overdue';

export interface Bill {
  id: string;
  clientId: string;
  amount: number;
  dueDate: string; // YYYY-MM-DD
  status: BillStatus;
}

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface Employee {
  id: string;
  name: string;
  availability: Record<DayOfWeek, boolean>;
}

export type DocumentType = 'Rechnung' | 'Vertrag' | 'Sonstiges';

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  uploadDate: string; // YYYY-MM-DD
  filePath: string;
  fileSize: number; // in bytes
}

export type EmailStatus = 'unread' | 'read' | 'converted';

export interface Email {
  id: string;
  from: string;
  subject: string;
  content: string;
  receivedDate: string; // YYYY-MM-DD HH:mm
  status: EmailStatus;
  keywords: string[]; // Keywords that triggered import (e.g., "Preisanfrage")
  attachments?: string[];
}