import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Task, TaskStatus } from '../types';
import { useData } from '../context/DataContext';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'status'>) => void;
  onDelete?: (taskId: string) => void;
  task?: Task;
}

export default function TaskFormModal({ isOpen, onClose, onSave, onDelete, task }: TaskFormModalProps) {
  const { clients, employees, addClient } = useData();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [clientId, setClientId] = useState('');
  const [clientMode, setClientMode] = useState<'existing' | 'new'>('existing');
  const [newClientName, setNewClientName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [assignedTo, setAssignedTo] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setClientId(task.clientId);
      setContactPerson(task.contactPerson || '');
      setAssignedTo(task.assignedTo);
      setDueDate(task.dueDate);
      setClientMode('existing');
      setNewClientName('');
    } else {
      setTitle('');
      setDescription('');
      setClientId('');
      setContactPerson('');
      setAssignedTo([]);
      setDueDate('');
      setClientMode('existing');
      setNewClientName('');
    }
  }, [task, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('✅ TaskFormModal submit - preventDefault called');

    let finalClientId = clientId;

    // If creating a new client, create it first
    if (clientMode === 'new' && newClientName.trim()) {
      const newClientId = `c${Date.now()}`;
      await addClient({
        name: newClientName.trim(),
        address: '',
        contactPerson: contactPerson.trim() || undefined,
      });
      finalClientId = newClientId;
    }

    onSave({
      title,
      description,
      clientId: finalClientId,
      contactPerson: contactPerson.trim() || undefined,
      assignedTo,
      dueDate,
    });
    onClose();
    return false;
  };

  const toggleEmployee = (employeeId: string) => {
    setAssignedTo(prev =>
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleDelete = () => {
    if (task && onDelete && window.confirm('Möchten Sie diese Aufgabe wirklich löschen?')) {
      onDelete(task.id);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task ? 'Aufgabe bearbeiten' : 'Neuer Auftrag'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Titel *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-green dark:bg-gray-700 dark:text-gray-100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Beschreibung *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-green dark:bg-gray-700 dark:text-gray-100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Kunde *
          </label>

          {/* Client Mode Toggle */}
          <div className="flex space-x-4 mb-3">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                value="existing"
                checked={clientMode === 'existing'}
                onChange={(e) => setClientMode(e.target.value as 'existing' | 'new')}
                className="w-4 h-4 text-brand-green focus:ring-brand-green"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Bestehender Kunde</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                value="new"
                checked={clientMode === 'new'}
                onChange={(e) => setClientMode(e.target.value as 'existing' | 'new')}
                className="w-4 h-4 text-brand-green focus:ring-brand-green"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Neuer Kunde</span>
            </label>
          </div>

          {/* Existing Client Dropdown */}
          {clientMode === 'existing' && (
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-green dark:bg-gray-700 dark:text-gray-100"
              required
            >
              <option value="">Kunde auswählen</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>
          )}

          {/* New Client Input */}
          {clientMode === 'new' && (
            <input
              type="text"
              value={newClientName}
              onChange={(e) => setNewClientName(e.target.value)}
              placeholder="Kundenname eingeben"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-green dark:bg-gray-700 dark:text-gray-100"
              required
            />
          )}
        </div>

        {/* Contact Person Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Ansprechpartner (optional)
          </label>
          <input
            type="text"
            value={contactPerson}
            onChange={(e) => setContactPerson(e.target.value)}
            placeholder="Name des Ansprechpartners"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-green dark:bg-gray-700 dark:text-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Fälligkeitsdatum *
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-green dark:bg-gray-700 dark:text-gray-100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Zuweisen an
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {employees.map(employee => (
              <label key={employee.id} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={assignedTo.includes(employee.id)}
                  onChange={() => toggleEmployee(employee.id)}
                  className="w-5 h-5 text-brand-green focus:ring-brand-green rounded"
                />
                <span className="text-gray-700 dark:text-gray-300">{employee.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <div>
            {task && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Löschen
              </button>
            )}
          </div>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-brand-green text-white rounded-lg hover:bg-brand-green-dark"
            >
              {task ? 'Speichern' : 'Hinzufügen'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
