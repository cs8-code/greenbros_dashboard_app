import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, Client, Bill, Employee, TaskStatus } from '../types';

const API_URL = 'http://localhost:3001/api';

interface DataContextType {
  tasks: Task[];
  clients: Client[];
  bills: Bill[];
  employees: Employee[];
  updateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  getClientById: (clientId: string) => Client | undefined;
  getEmployeeById: (employeeId: string) => Employee | undefined;
  addTask: (task: Omit<Task, 'id' | 'status'>) => void;
  addClient: (client: Omit<Client, 'id'>) => void;
  loading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all data on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [tasksRes, clientsRes, billsRes, employeesRes] = await Promise.all([
        fetch(`${API_URL}/tasks`),
        fetch(`${API_URL}/clients`),
        fetch(`${API_URL}/bills`),
        fetch(`${API_URL}/employees`),
      ]);

      const [tasksData, clientsData, billsData, employeesData] = await Promise.all([
        tasksRes.json(),
        clientsRes.json(),
        billsRes.json(),
        employeesRes.json(),
      ]);

      setTasks(tasksData);
      setClients(clientsData);
      setBills(billsData);
      setEmployees(employeesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === taskId ? { ...task, status: newStatus } : task
          )
        );
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const addTask = async (taskData: Omit<Task, 'id' | 'status'>) => {
    const newTask: Task = {
      ...taskData,
      id: `t${Date.now()}`,
      status: 'open',
    };

    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        setTasks(prevTasks => [newTask, ...prevTasks]);
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const addClient = async (clientData: Omit<Client, 'id'>) => {
    const newClient: Client = {
      ...clientData,
      id: `c${Date.now()}`
    };

    try {
      const response = await fetch(`${API_URL}/clients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient),
      });

      if (response.ok) {
        setClients(prevClients => [newClient, ...prevClients]);
      }
    } catch (error) {
      console.error('Error adding client:', error);
    }
  };

  const getClientById = (clientId: string) => clients.find(c => c.id === clientId);
  const getEmployeeById = (employeeId: string) => employees.find(e => e.id === employeeId);

  return (
    <DataContext.Provider value={{ tasks, clients, bills, employees, updateTaskStatus, getClientById, getEmployeeById, addTask, addClient, loading }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};