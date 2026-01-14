import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Client } from '../types';
import ClientFormModal from './ClientFormModal';

const ClientsList: React.FC = () => {
    const { clients, addClient, updateClient, deleteClient } = useData();
    const [expandedClientId, setExpandedClientId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | undefined>(undefined);

    const toggleClient = (clientId: string) => {
        setExpandedClientId(prevId => (prevId === clientId ? null : clientId));
    };

    const handleAddClient = () => {
        setEditingClient(undefined);
        setIsModalOpen(true);
    };

    const handleEditClient = (client: Client, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingClient(client);
        setIsModalOpen(true);
    };

    const handleDeleteClient = (clientId: string) => {
        deleteClient(clientId);
    };

    const handleSaveClient = (clientData: Omit<Client, 'id'>) => {
        if (editingClient) {
            updateClient(editingClient.id, clientData);
        } else {
            addClient(clientData);
        }
    };

    return (
        <>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <button
                        onClick={handleAddClient}
                        className="ml-auto bg-brand-green hover:bg-brand-green-dark text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200 flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        Neuer Kunde
                    </button>
                <div className="flex justify-between items-center mb-4">
                  
                </div>
                <div className="space-y-2">
                    {clients.map(client => {
                        const isOpen = expandedClientId === client.id;
                        
                        return (
                            <div key={client.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                <button 
                                    onClick={() => toggleClient(client.id)}
                                    className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700/50 dark:hover:bg-gray-700 text-left transition-colors"
                                >
                                    <div>
                                        <p className="font-semibold text-lg text-gray-900 dark:text-gray-100">{client.name}</p>
                                        <div className="flex items-center mt-1 text-gray-500 dark:text-gray-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-gray-400 dark:text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span className="text-sm">{client.address}</span>
                                        </div>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {isOpen && (
                                    <div className="p-4 bg-white dark:bg-gray-800">
                                        <div className="flex justify-end mb-4">
                                            <button
                                                onClick={(e) => handleEditClient(client, e)}
                                                className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center space-x-2"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                <span>Bearbeiten</span>
                                            </button>
                                        </div>
                                        <div className="space-y-3">
                                            {client.contactPerson && (
                                                <div className="flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    <div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">Ansprechpartner</p>
                                                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{client.contactPerson}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {client.phone && (
                                                <div className="flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                    <div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">Telefon</p>
                                                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{client.phone}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {client.email && (
                                                <div className="flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                    <div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">E-Mail</p>
                                                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{client.email}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {!client.contactPerson && !client.phone && !client.email && (
                                                <p className="text-gray-500 dark:text-gray-400 text-sm">Keine weiteren Informationen verfügbar.</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <ClientFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveClient}
                onDelete={handleDeleteClient}
                client={editingClient}
            />
        </>
    );
};

export default ClientsList;