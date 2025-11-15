
import React from 'react';
import { useData } from '../context/DataContext';
import { Task, TaskStatus, Employee } from '../types';
import { getInitials, getColorFromName } from '../utils/getInitials';

// Helper to get status chip styles
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

const TaskRow: React.FC<{ task: Task }> = ({ task }) => {
    const { getEmployeeById } = useData();
    const assignedTeam = task.assignedTo.map(id => getEmployeeById(id)).filter(Boolean) as Employee[];

    return (
        <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <td className="p-4">
                <p className="font-semibold text-gray-800 dark:text-gray-100">{task.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">{task.description}</p>
            </td>
            <td className="p-4 text-center">
                {getStatusChip(task.status)}
            </td>
            <td className="p-4 text-gray-700 dark:text-gray-300 text-center">
                {new Date(task.dueDate).toLocaleDateString('de-DE')}
            </td>
            <td className="p-4">
                <div className="flex -space-x-2 justify-center">
                    {assignedTeam.length > 0 ? assignedTeam.map(member => (
                        <div key={member.id} title={member.name} className={`w-8 h-8 rounded-full border-2 border-white dark:border-gray-700 flex items-center justify-center text-white text-xs font-bold ${getColorFromName(member.name)}`}>
                            {getInitials(member.name)}
                        </div>
                    )) : <span className="text-xs text-gray-400">Niemand</span>}
                </div>
            </td>
        </tr>
    );
};

const TasksByClient: React.FC = () => {
    const { tasks, clients } = useData();

    const tasksByClientId = React.useMemo(() => {
        return tasks.reduce((acc, task) => {
            (acc[task.clientId] = acc[task.clientId] || []).push(task);
            return acc;
        }, {} as Record<string, Task[]>);
    }, [tasks]);

    return (
        <div className="space-y-8">
            {clients.map(client => {
                const clientTasks = tasksByClientId[client.id] || [];
                return (
                    <div key={client.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">{client.name}</h2>
                        {clientTasks.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 dark:bg-gray-700/50 border-b-2 border-gray-200 dark:border-gray-700">
                                        <tr>
                                            <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-400 w-2/5">Aufgabe</th>
                                            <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-400 text-center">Status</th>
                                            <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-400 text-center">Fälligkeit</th>
                                            <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-400 text-center">Zugewiesen</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {clientTasks
                                            .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                                            .map(task => <TaskRow key={task.id} task={task} />
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400">Für diesen Kunden sind keine Aufgaben geplant.</p>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default TasksByClient;
