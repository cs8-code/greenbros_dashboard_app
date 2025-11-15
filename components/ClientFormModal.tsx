import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Client } from '../types';

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: Omit<Client, 'id'>) => void;
  onDelete?: (clientId: string) => void;
  client?: Client;
}

export default function ClientFormModal({ isOpen, onClose, onSave, onDelete, client }: ClientFormModalProps) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (client) {
      setName(client.name);
      setAddress(client.address);
      setContactPerson(client.contactPerson || '');
      setPhone(client.phone || '');
      setEmail(client.email || '');
    } else {
      setName('');
      setAddress('');
      setContactPerson('');
      setPhone('');
      setEmail('');
    }
  }, [client, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      address,
      contactPerson: contactPerson || undefined,
      phone: phone || undefined,
      email: email || undefined,
    });
    onClose();
  };

  const handleDelete = () => {
    if (client && onDelete && window.confirm('Möchten Sie diesen Kunden wirklich löschen?')) {
      onDelete(client.id);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={client ? 'Kunde bearbeiten' : 'Neuer Kunde'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Name *
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Adresse *
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-green dark:bg-gray-700 dark:text-gray-100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Ansprechpartner
          </label>
          <input
            type="text"
            value={contactPerson}
            onChange={(e) => setContactPerson(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-green dark:bg-gray-700 dark:text-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Telefon
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-green dark:bg-gray-700 dark:text-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            E-Mail
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-green dark:bg-gray-700 dark:text-gray-100"
          />
        </div>

        <div className="flex justify-between pt-4">
          <div>
            {client && onDelete && (
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
              {client ? 'Speichern' : 'Hinzufügen'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
