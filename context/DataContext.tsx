import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, Client, Bill, Employee, TaskStatus, Document, DocumentType, Email, EmailStatus } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface DataContextType {
  tasks: Task[];
  clients: Client[];
  bills: Bill[];
  employees: Employee[];
  documents: Document[];
  emails: Email[];
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
  uploadDocument: (file: File, type: DocumentType) => Promise<void>;
  deleteDocument: (documentId: string) => void;
  downloadDocument: (documentId: string, fileName: string) => void;
  addEmail: (email: Omit<Email, 'id' | 'status' | 'receivedDate'>) => Promise<void>;
  sendEmail: (emailData: { to: string; subject: string; content: string }) => Promise<void>;
  fetchEmailsFromGmail: () => Promise<number>;
  updateEmailStatus: (emailId: string, status: EmailStatus) => void;
  deleteEmail: (emailId: string) => void;
  createTaskFromEmail: (email: Email, taskData: Partial<Task>) => void;
  revertEmailConversion: (emailId: string) => Promise<void>;
  analyzeEmailWithAI: (emailId: string) => Promise<any>;
  loading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all data on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [tasksRes, clientsRes, billsRes, employeesRes, documentsRes, emailsRes] = await Promise.all([
        fetch(`${API_URL}/tasks`),
        fetch(`${API_URL}/clients`),
        fetch(`${API_URL}/bills`),
        fetch(`${API_URL}/employees`),
        fetch(`${API_URL}/documents`),
        fetch(`${API_URL}/emails`),
      ]);

      const [tasksData, clientsData, billsData, employeesData, documentsData, emailsData] = await Promise.all([
        tasksRes.json(),
        clientsRes.json(),
        billsRes.json(),
        employeesRes.json(),
        documentsRes.json(),
        emailsRes.json(),
      ]);

      setTasks(tasksData);
      setClients(clientsData);
      setBills(billsData);
      setEmployees(employeesData);
      setDocuments(documentsData);
      setEmails(emailsData);
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

  // Upload Document
  const uploadDocument = async (file: File, type: DocumentType) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch(`${API_URL}/documents`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const newDocument = await response.json();
        setDocuments(prevDocuments => [...prevDocuments, newDocument]);
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  };

  // Delete Document
  const deleteDocument = async (documentId: string) => {
    try {
      const response = await fetch(`${API_URL}/documents/${documentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setDocuments(prevDocuments => prevDocuments.filter(doc => doc.id !== documentId));
      }
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  // Download Document
  const downloadDocument = (documentId: string, fileName: string) => {
    const url = `${API_URL}/documents/${documentId}/download`;
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
  };

  // Add Email (manual import)
  const addEmail = async (emailData: Omit<Email, 'id' | 'status' | 'receivedDate'>) => {
    try {
      const response = await fetch(`${API_URL}/emails`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailData),
      });

      if (response.ok) {
        const newEmail = await response.json();
        setEmails(prevEmails => [newEmail, ...prevEmails]);
      } else {
        const errorText = await response.text();
        console.error('Failed to add email. Status:', response.status, 'Error:', errorText);
        throw new Error(`Failed to add email: ${response.status}`);
      }
    } catch (error) {
      console.error('Error adding email:', error);
      throw error;
    }
  };

  // Update Email Status
  const updateEmailStatus = async (emailId: string, status: EmailStatus) => {
    try {
      const response = await fetch(`${API_URL}/emails/${emailId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setEmails(prevEmails =>
          prevEmails.map(email =>
            email.id === emailId ? { ...email, status } : email
          )
        );
      }
    } catch (error) {
      console.error('Error updating email status:', error);
    }
  };

  // Delete Email
  const deleteEmail = async (emailId: string) => {
    try {
      const response = await fetch(`${API_URL}/emails/${emailId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setEmails(prevEmails => prevEmails.filter(email => email.id !== emailId));
      }
    } catch (error) {
      console.error('Error deleting email:', error);
    }
  };

  // Create Task from Email
  const createTaskFromEmail = async (email: Email, taskData: Partial<Task>) => {
    const newTask: Task = {
      id: `t${Date.now()}`,
      title: taskData.title || email.subject,
      clientId: taskData.clientId || '',
      assignedTo: taskData.assignedTo || [],
      dueDate: taskData.dueDate || new Date().toISOString().split('T')[0],
      status: 'open',
      description: taskData.description || email.content,
    };

    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        setTasks(prevTasks => [newTask, ...prevTasks]);

        // Update email status to converted and store task ID
        const updateResponse = await fetch(`${API_URL}/emails/${email.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'converted', relatedTaskId: newTask.id }),
        });

        if (updateResponse.ok) {
          setEmails(prevEmails =>
            prevEmails.map(e =>
              e.id === email.id ? { ...e, status: 'converted', relatedTaskId: newTask.id } : e
            )
          );
        }
      }
    } catch (error) {
      console.error('Error creating task from email:', error);
    }
  };

  // Revert Email Conversion
  const revertEmailConversion = async (emailId: string) => {
    const email = emails.find(e => e.id === emailId);
    if (!email || !email.relatedTaskId) {
      console.error('Email not found or no related task');
      return;
    }

    try {
      // Delete the related task
      const deleteResponse = await fetch(`${API_URL}/tasks/${email.relatedTaskId}`, {
        method: 'DELETE',
      });

      if (deleteResponse.ok) {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== email.relatedTaskId));

        // Update email status back to read and remove task reference
        const updateResponse = await fetch(`${API_URL}/emails/${emailId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'read', relatedTaskId: null }),
        });

        if (updateResponse.ok) {
          setEmails(prevEmails =>
            prevEmails.map(e =>
              e.id === emailId ? { ...e, status: 'read', relatedTaskId: undefined } : e
            )
          );
        }
      }
    } catch (error) {
      console.error('Error reverting email conversion:', error);
      throw error;
    }
  };

  // Analyze Email with AI
  const analyzeEmailWithAI = async (emailId: string) => {
    try {
      const response = await fetch(`${API_URL}/emails/${emailId}/analyze`, {
        method: 'POST',
      });

      if (response.ok) {
        const analysis = await response.json();
        return analysis;
      } else {
        throw new Error('Failed to analyze email');
      }
    } catch (error) {
      console.error('Error analyzing email with AI:', error);
      throw error;
    }
  };

  // Send Email
  const sendEmail = async (emailData: { to: string; subject: string; content: string }) => {
    try {
      const response = await fetch(`${API_URL}/emails`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...emailData,
          type: 'sent',
          from: 'office@greenbros.de',
          keywords: [],
          attachments: []
        }),
      });

      if (response.ok) {
        const newEmail = await response.json();
        setEmails(prevEmails => [newEmail, ...prevEmails]);
      } else {
        const errorText = await response.text();
        console.error('Failed to send email. Status:', response.status, 'Error:', errorText);
        throw new Error(`Failed to send email: ${response.status}`);
      }
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  };

  // Fetch Emails from Gmail
  const fetchEmailsFromGmail = async (): Promise<number> => {
    try {
      const response = await fetch(`${API_URL}/emails/fetch`, {
        method: 'POST',
      });

      if (response.ok) {
        const result = await response.json();

        // Add new emails to state
        if (result.emails && result.emails.length > 0) {
          setEmails(prevEmails => [...result.emails, ...prevEmails]);
        }

        return result.count;
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch emails from Gmail. Status:', response.status, 'Error:', errorText);
        throw new Error(`Failed to fetch emails from Gmail: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching emails from Gmail:', error);
      throw error;
    }
  };

  return (
    <DataContext.Provider value={{
      tasks,
      clients,
      bills,
      employees,
      documents,
      emails,
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
      uploadDocument,
      deleteDocument,
      downloadDocument,
      addEmail,
      sendEmail,
      fetchEmailsFromGmail,
      updateEmailStatus,
      deleteEmail,
      createTaskFromEmail,
      revertEmailConversion,
      analyzeEmailWithAI,
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