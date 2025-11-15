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
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateTask: (taskId: string, task: Partial<Task>) => void;
  updateClient: (clientId: string, client: Partial<Client>) => void;
  updateEmployee: (employeeId: string, employee: Partial<Employee>) => void;
  deleteTask: (taskId: string) => void;
  deleteClient: (clientId: string) => void;
  deleteEmployee: (employeeId: string) => void;
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

  // Add Employee
  const addEmployee = async (employeeData: Omit<Employee, 'id'>) => {
    const newEmployee: Employee = {
      ...employeeData,
      id: `e${Date.now()}`
    };

    try {
      const response = await fetch(`${API_URL}/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEmployee),
      });

      if (response.ok) {
        setEmployees(prevEmployees => [...prevEmployees, newEmployee]);
      }
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  // Update Task
  const updateTask = async (taskId: string, taskData: Partial<Task>) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === taskId ? { ...task, ...taskData } : task
          )
        );
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Update Client
  const updateClient = async (clientId: string, clientData: Partial<Client>) => {
    try {
      const response = await fetch(`${API_URL}/clients/${clientId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData),
      });

      if (response.ok) {
        setClients(prevClients =>
          prevClients.map(client =>
            client.id === clientId ? { ...client, ...clientData } : client
          )
        );
      }
    } catch (error) {
      console.error('Error updating client:', error);
    }
  };

  // Update Employee
  const updateEmployee = async (employeeId: string, employeeData: Partial<Employee>) => {
    try {
      const response = await fetch(`${API_URL}/employees/${employeeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employeeData),
      });

      if (response.ok) {
        setEmployees(prevEmployees =>
          prevEmployees.map(employee =>
            employee.id === employeeId ? { ...employee, ...employeeData } : employee
          )
        );
      }
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  // Delete Task
  const deleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Delete Client
  const deleteClient = async (clientId: string) => {
    try {
      const response = await fetch(`${API_URL}/clients/${clientId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setClients(prevClients => prevClients.filter(client => client.id !== clientId));
      }
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  // Delete Employee
  const deleteEmployee = async (employeeId: string) => {
    try {
      const response = await fetch(`${API_URL}/employees/${employeeId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setEmployees(prevEmployees => prevEmployees.filter(employee => employee.id !== employeeId));
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  return (
    <DataContext.Provider value={{
      tasks,
      clients,
      bills,
      employees,
      updateTaskStatus,
      getClientById,
      getEmployeeById,
      addTask,
      addClient,
      addEmployee,
      updateTask,
      updateClient,
      updateEmployee,
      deleteTask,
      deleteClient,
      deleteEmployee,
      loading
    }}>
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