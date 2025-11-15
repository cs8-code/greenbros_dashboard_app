import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Employee, DayOfWeek } from '../types';

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employee: Omit<Employee, 'id'>) => void;
  onDelete?: (employeeId: string) => void;
  employee?: Employee;
}

const DAYS: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const DAY_LABELS: Record<DayOfWeek, string> = {
  monday: 'Montag',
  tuesday: 'Dienstag',
  wednesday: 'Mittwoch',
  thursday: 'Donnerstag',
  friday: 'Freitag',
  saturday: 'Samstag',
  sunday: 'Sonntag',
};

export default function EmployeeFormModal({ isOpen, onClose, onSave, onDelete, employee }: EmployeeFormModalProps) {
  const [name, setName] = useState('');
  const [availability, setAvailability] = useState<Record<DayOfWeek, boolean>>({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false,
  });

  useEffect(() => {
    if (employee) {
      setName(employee.name);
      setAvailability(employee.availability);
    } else {
      setName('');
      setAvailability({
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: false,
        sunday: false,
      });
    }
  }, [employee, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, availability });
    onClose();
  };

  const handleDelete = () => {
    if (employee && onDelete && window.confirm('Möchten Sie diesen Mitarbeiter wirklich löschen?')) {
      onDelete(employee.id);
      onClose();
    }
  };

  const toggleDay = (day: DayOfWeek) => {
    setAvailability(prev => ({ ...prev, [day]: !prev[day] }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={employee ? 'Mitarbeiter bearbeiten' : 'Neuer Mitarbeiter'}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-green dark:bg-gray-700 dark:text-gray-100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Verfügbarkeit
          </label>
          <div className="space-y-2">
            {DAYS.map((day) => (
              <label key={day} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={availability[day]}
                  onChange={() => toggleDay(day)}
                  className="w-5 h-5 text-brand-green focus:ring-brand-green rounded"
                />
                <span className="text-gray-700 dark:text-gray-300">{DAY_LABELS[day]}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <div>
            {employee && onDelete && (
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
              {employee ? 'Speichern' : 'Hinzufügen'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
