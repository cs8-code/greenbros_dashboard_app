
import React from 'react';
import { useData } from '../context/DataContext';
import { BillStatus } from '../types';

const BillsList: React.FC = () => {
    const { bills, getClientById } = useData();

    const getStatusChip = (status: BillStatus) => {
        switch(status) {
            case 'paid':
                return <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">Bezahlt</span>;
            case 'due':
                return <span className="px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300">Fällig</span>;
            case 'overdue':
                return <span className="px-3 py-1 text-sm rounded-full bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300">Überfällig</span>;
        }
    };
    
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Rechnungen</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700/50 border-b-2 border-gray-200 dark:border-gray-700">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Rechnungs-ID</th>
                            <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Kundenname</th>
                            <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Betrag</th>
                            <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Fälligkeitsdatum</th>
                            <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bills.map(bill => (
                            <tr key={bill.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="p-4 font-mono text-sm text-gray-700 dark:text-gray-300">{bill.id.toUpperCase()}</td>
                                <td className="p-4 font-medium text-gray-900 dark:text-gray-100">{getClientById(bill.clientId)?.name}</td>
                                <td className="p-4 text-gray-700 dark:text-gray-300">{bill.amount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</td>
                                <td className="p-4 text-gray-700 dark:text-gray-300">{new Date(bill.dueDate).toLocaleDateString('de-DE')}</td>
                                <td className="p-4">{getStatusChip(bill.status)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BillsList;