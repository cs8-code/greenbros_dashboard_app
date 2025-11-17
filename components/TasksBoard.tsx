import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Task, TaskStatus, Employee } from '../types';
import TaskFormModal from './TaskFormModal';
import { getInitials, getColorFromName } from '../utils/getInitials';

const TaskCard: React.FC<{ task: Task; onEdit: (task: Task) => void; onDelete: (taskId: string) => void }> = ({ task, onEdit }) => {
    const { getClientById, getEmployeeById } = useData();
    const client = getClientById(task.clientId);
    const assignedTeam = task.assignedTo.map(id => getEmployeeById(id)).filter(Boolean) as Employee[];

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData("taskId", task.id);
    };

    const handleClick = (e: React.MouseEvent) => {
        // Only open edit if not dragging
        if (e.detail === 2) { // Double click
            onEdit(task);
        }
    };

    return (
        <div
            draggable
            onDragStart={handleDragStart}
            onDoubleClick={handleClick}
            className="bg-white dark:bg-gray-800 p-4 mb-4 rounded-lg shadow-sm border-l-4 border-brand-green dark:border-brand-green-dark cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
            title="Doppelklick zum Bearbeiten"
        >
            <h4 className="font-bold text-gray-800 dark:text-gray-100">{task.title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{client?.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-300 mt-2">{task.description}</p>
            <div className="flex items-center justify-between mt-4">
                <div className="flex -space-x-2">
                    {assignedTeam.map(member => (
                        <div key={member.id} title={member.name} className={`w-8 h-8 rounded-full border-2 border-white dark:border-gray-700 flex items-center justify-center text-white text-xs font-bold ${getColorFromName(member.name)}`}>
                            {getInitials(member.name)}
                        </div>
                    ))}
                </div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{new Date(task.dueDate).toLocaleDateString('de-DE')}</span>
            </div>
        </div>
    );
};


interface ColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onDrop: (status: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const Column: React.FC<ColumnProps> = ({ title, status, tasks, onDrop, onEditTask, onDeleteTask }) => {
    const [isOver, setIsOver] = useState(false);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsOver(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsOver(false);
    };
    
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        onDrop(status);
        setIsOver(false);
    };

    const statusColors = {
        open: 'border-blue-500',
        'in-progress': 'border-yellow-500',
        completed: 'border-green-500'
    };
    
    return (
        <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`bg-gray-100 dark:bg-gray-900/50 rounded-lg p-4 w-full md:w-1/3 flex-shrink-0 transition-colors duration-300 ${isOver ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
        >
            <h3 className={`text-lg font-bold text-gray-700 dark:text-gray-300 mb-4 pb-2 border-b-4 ${statusColors[status]}`}>
                {title} ({tasks.length})
            </h3>
            <div className="h-[calc(100vh-32rem)] overflow-y-auto pr-2">
                {tasks.map(task => (
                    <TaskCard key={task.id} task={task} onEdit={onEditTask} onDelete={onDeleteTask} />
                ))}
            </div>
        </div>
    );
};

const TasksBoard: React.FC = () => {
    const { tasks, clients, employees, updateTaskStatus, addTask, updateTask, deleteTask } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

    const [filterClient, setFilterClient] = useState('all');
    const [filterEmployee, setFilterEmployee] = useState('all');
    const [filterDueDate, setFilterDueDate] = useState('all');
    const [sortBy, setSortBy] = useState('default');


    const handleDrop = (targetStatus: TaskStatus, e: React.DragEvent<HTMLDivElement>) => {
        const taskId = e.dataTransfer.getData("taskId");
        if(taskId) {
            updateTaskStatus(taskId, targetStatus);
        }
    };

    const handleAddTask = () => {
        setEditingTask(undefined);
        setIsModalOpen(true);
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const handleDeleteTask = (taskId: string) => {
        deleteTask(taskId);
    };

    const handleSaveTask = (taskData: Omit<Task, 'id' | 'status'>) => {
        if (editingTask) {
            updateTask(editingTask.id, taskData);
        } else {
            addTask(taskData);
        }
    };

    const filteredAndSortedTasks = useMemo(() => {
        let processedTasks = [...tasks];

        // Filtering
        if (filterClient !== 'all') {
            processedTasks = processedTasks.filter(t => t.clientId === filterClient);
        }
        if (filterEmployee !== 'all') {
            processedTasks = processedTasks.filter(t => t.assignedTo.includes(filterEmployee));
        }
        if (filterDueDate !== 'all') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todayStr = today.toISOString().split('T')[0];
            
            switch (filterDueDate) {
                case 'today':
                    processedTasks = processedTasks.filter(t => t.dueDate === todayStr);
                    break;
                case 'this_week':
                    const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)));
                    firstDayOfWeek.setHours(0,0,0,0);
                    const lastDayOfWeek = new Date(firstDayOfWeek);
                    lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);
                    lastDayOfWeek.setHours(23,59,59,999);
                    
                    processedTasks = processedTasks.filter(t => {
                        const dueDate = new Date(t.dueDate);
                        return dueDate >= firstDayOfWeek && dueDate <= lastDayOfWeek;
                    });
                    break;
                case 'overdue':
                    processedTasks = processedTasks.filter(t => t.dueDate < todayStr && t.status !== 'completed');
                    break;
            }
        }
        
        // Sorting
        if (sortBy === 'dueDate') {
            processedTasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
        } else if (sortBy === 'title') {
            processedTasks.sort((a, b) => a.title.localeCompare(b.title, 'de-DE'));
        }

        return processedTasks;
    }, [tasks, filterClient, filterEmployee, filterDueDate, sortBy]);

    const completedTasksCount = useMemo(() => {
        return filteredAndSortedTasks.filter(task => task.status === 'completed').length;
    }, [filteredAndSortedTasks]);

    const totalTasksCount = filteredAndSortedTasks.length;
    const progressPercentage = totalTasksCount > 0 ? (completedTasksCount / totalTasksCount) * 100 : 0;
    
    const columns: {title: string; status: TaskStatus}[] = [
        { title: 'Offene Aufträge', status: 'open' },
        { title: 'In Arbeit', status: 'in-progress' },
        { title: 'Abgeschlossen', status: 'completed' },
    ];

    return (
        <>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                 <div className="flex flex-wrap items-center gap-4 flex-grow">
                    <select value={filterClient} onChange={e => setFilterClient(e.target.value)} className="p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <option value="all">Alle Kunden</option>
                        {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <select value={filterEmployee} onChange={e => setFilterEmployee(e.target.value)} className="p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <option value="all">Alle Mitarbeiter</option>
                        {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                    </select>
                    <select value={filterDueDate} onChange={e => setFilterDueDate(e.target.value)} className="p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <option value="all">Alle Fälligkeiten</option>
                        <option value="today">Heute</option>
                        <option value="this_week">Diese Woche</option>
                        <option value="overdue">Überfällig</option>
                    </select>
                    <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <option value="default">Sortieren nach...</option>
                        <option value="dueDate">Fälligkeitsdatum</option>
                        <option value="title">Titel</option>
                    </select>
                 </div>
                 <button
                    onClick={handleAddTask}
                    className="bg-brand-green hover:bg-brand-green-dark text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200 flex items-center flex-shrink-0"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Neuer Auftrag
                </button>
            </div>

            <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="flex justify-between items-center mb-2 text-sm">
                    <h3 className="font-semibold text-gray-700 dark:text-gray-200">Fortschritt der gefilterten Aufgaben</h3>
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                        {completedTasksCount} von {totalTasksCount} abgeschlossen ({Math.round(progressPercentage)}%)
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div
                        className="bg-brand-green h-2.5 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 h-full">
                {columns.map(col => (
                    <Column
                        key={col.status}
                        title={col.title}
                        status={col.status}
                        tasks={filteredAndSortedTasks.filter(t => t.status === col.status)}
                        onDrop={(newStatus) => {
                            const event = window.event as unknown as React.DragEvent<HTMLDivElement>;
                            handleDrop(newStatus, event);
                        }}
                        onEditTask={handleEditTask}
                        onDeleteTask={handleDeleteTask}
                    />
                ))}
            </div>

            <TaskFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveTask}
                onDelete={handleDeleteTask}
                task={editingTask}
            />
        </>
    );
};

export default TasksBoard;