import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Task, TaskStatus, Employee } from '../types';
import AddClientModal from './AddClientModal';

const getStatusChip = (status: TaskStatus) => {
    switch (status) {
        case 'open':
            return <div className="px-3 py-1 text-xs font-medium rounded-full capitalize bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">Offen</div>;
        case 'in-progress':
            return <div className="px-3 py-1 text-xs font-medium rounded-full capitalize bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300">In Arbeit</div>;
        case 'completed':
            return <div className="px-3 py-1 text-xs font-medium rounded-full capitalize bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">Abgeschlossen</div>;
    }
};

const ClientTaskRow: React.FC<{ task: Task }> = ({ task }) => {
    const { getEmployeeById } = useData();
    const assignedTeam = task.assignedTo.map(id => getEmployeeById(id)).filter(Boolean) as Employee[];

    return (
        <tr className="border-b border-gray-200 dark:border-gray-700">
            <td className="p-3">
                <p className="font-medium text-gray-800 dark:text-gray-200">{task.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{task.description}</p>
            </td>
            <td className="p-3 text-center">{getStatusChip(task.status)}</td>
            <td className="p-3 text-center text-gray-700 dark:text-gray-300">{new Date(task.dueDate).toLocaleDateString('de-DE')}</td>
            <td className="p-3">
                <div className="flex -space-x-2 justify-center">
                    {assignedTeam.length > 0 ? assignedTeam.map(member => (
                        <img key={member.id} src={member.avatarUrl} alt={member.name} title={member.name} className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-600"/>
                    )) : <span className="text-xs text-gray-400">Niemand</span>}
                </div>
            </td>
        </tr>
    );
};

const ClientsList: React.FC = () => {
    const { clients, tasks } = useData();
    const [expandedClientId, setExpandedClientId] = useState<string | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const toggleClient = (clientId: string) => {
        setExpandedClientId(prevId => (prevId === clientId ? null : clientId));
    };

    return (
        <>
            <AddClientModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Unsere Kunden</h2>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-brand-green hover:bg-brand-green-dark text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200 flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        Neuer Kunde
                    </button>
                </div>
                <div className="space-y-2">
                    {clients.map(client => {
                        const clientTasks = tasks.filter(task => task.clientId === client.id);
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
                                    <div className="flex items-center space-x-4">
                                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-600">{clientTasks.length} Aufgabe(n)</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </button>
                                {isOpen && (
                                    <div className="p-4 bg-white dark:bg-gray-800">
                                        {clientTasks.length > 0 ? (
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left text-sm">
                                                    <thead className="border-b-2 border-gray-200 dark:border-gray-600">
                                                        <tr>
                                                            <th className="p-2 font-semibold text-gray-600 dark:text-gray-400 w-2/5">Aufgabe</th>
                                                            <th className="p-2 font-semibold text-gray-600 dark:text-gray-400 text-center">Status</th>
                                                            <th className="p-2 font-semibold text-gray-600 dark:text-gray-400 text-center">Fälligkeit</th>
                                                            <th className="p-2 font-semibold text-gray-600 dark:text-gray-400 text-center">Zugewiesen</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {clientTasks
                                                            .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                                                            .map(task => <ClientTaskRow key={task.id} task={task} />
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 dark:text-gray-400 px-2 py-4">Für diesen Kunden sind keine Aufgaben geplant.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default ClientsList;