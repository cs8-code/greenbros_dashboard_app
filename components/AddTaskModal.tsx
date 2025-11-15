
import React, { useState, FormEvent } from 'react';
import { useData } from '../context/DataContext';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose }) => {
  const { clients, employees, addTask } = useData();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [clientId, setClientId] = useState('');
  const [assignedTo, setAssignedTo] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  const handleEmployeeToggle = (employeeId: string) => {
    setAssignedTo(prev =>
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setClientId('');
    setAssignedTo([]);
    setDueDate('');
    setError('');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title || !clientId || !dueDate) {
      setError('Titel, Kunde und Fälligkeitsdatum sind Pflichtfelder.');
      return;
    }
    addTask({
      title,
      description,
      clientId,
      assignedTo,
      dueDate,
    });
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Neue Aufgabe erstellen</h3>
          </div>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{error}</div>}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Titel</label>
              <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-green focus:border-brand-green dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
            <div>
              <label htmlFor="client" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kunde</label>
              <select id="client" value={clientId} onChange={e => setClientId(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-green focus:border-brand-green dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <option value="" disabled>Kunde auswählen</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Beschreibung</label>
              <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-green focus:border-brand-green dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
            </div>
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fälligkeitsdatum</label>
              <input type="date" id="dueDate" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-green focus:border-brand-green dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
            <div>
              <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Team zuweisen</span>
              <div className="grid grid-cols-2 gap-2">
                {employees.map(employee => (
                  <label key={employee.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
                    <input type="checkbox" checked={assignedTo.includes(employee.id)} onChange={() => handleEmployeeToggle(employee.id)} className="h-4 w-4 rounded border-gray-300 text-brand-green focus:ring-brand-green-dark dark:bg-gray-900 dark:border-gray-600" />
                    <span className="dark:text-gray-200">{employee.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end items-center p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 rounded-b-lg">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-dark dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 dark:border-gray-600">
              Abbrechen
            </button>
            <button type="submit" className="ml-3 px-4 py-2 text-sm font-medium text-white bg-brand-green border border-transparent rounded-md shadow-sm hover:bg-brand-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-dark">
              Aufgabe erstellen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;