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
  phone: string;
  email: string;
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