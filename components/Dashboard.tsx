import React from 'react';
import { useData } from '../context/DataContext';
import { Client, Employee, Task, TaskStatus, DayOfWeek } from '../types';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    darkColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, darkColor }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center">
        <div className={`p-3 rounded-full mr-4 ${color} ${darkColor}`}>
            {icon}
        </div>
        <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
        </div>
    </div>
);

const getStatusChip = (status: TaskStatus) => {
    switch (status) {
        case 'open':
            return <div className="px-3 py-1 text-sm rounded-full capitalize bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">Offen</div>;
        case 'in-progress':
            return <div className="px-3 py-1 text-sm rounded-full capitalize bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300">In Arbeit</div>;
        case 'completed':
            return <div className="px-3 py-1 text-sm rounded-full capitalize bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">Abgeschlossen</div>;
    }
};

const TaskRow: React.FC<{task: Task, client?: Client}> = ({task, client}) => (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex items-center justify-between hover:shadow-md dark:hover:bg-gray-700 transition-shadow">
        <div>
            <p className="font-semibold text-gray-800 dark:text-gray-100">{task.title}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{client?.name || 'Unbekannter Kunde'}</p>
        </div>
        {getStatusChip(task.status)}
    </div>
);

const TeamMemberRow: React.FC<{member: Employee}> = ({member}) => (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex items-center hover:shadow-md dark:hover:bg-gray-700 transition-shadow">
        <img src={member.avatarUrl} alt={member.name} className="w-12 h-12 rounded-full mr-4"/>
        <div>
            <p className="font-semibold text-gray-800 dark:text-gray-100">{member.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{member.role}</p>
        </div>
    </div>
);

const WeeklyCalendar: React.FC = () => {
    const { tasks } = useData();

    const today = new Date();
    const todayDateString = today.toISOString().split('T')[0];
    const currentDayOfWeek = today.getDay(); // Sunday is 0, Monday is 1
    
    // Calculate the first day of the week (Monday)
    const firstDayOfWeek = new Date(today);
    const diffToMonday = today.getDate() - currentDayOfWeek + (currentDayOfWeek === 0 ? -6 : 1);
    firstDayOfWeek.setDate(diffToMonday);
    firstDayOfWeek.setHours(0, 0, 0, 0);

    // Create an array of 7 Date objects for the current week
    const weekDays = Array.from({ length: 7 }).map((_, i) => {
        const day = new Date(firstDayOfWeek);
        day.setDate(firstDayOfWeek.getDate() + i);
        return day;
    });

    const startOfWeekStr = weekDays[0].toISOString().split('T')[0];
    const endOfWeekStr = weekDays[6].toISOString().split('T')[0];

    // Filter tasks that fall within the current week
    const thisWeeksTasks = tasks.filter(task => {
        const taskDate = task.dueDate;
        return taskDate >= startOfWeekStr && taskDate <= endOfWeekStr;
    });

    // Group tasks by their due date
    const tasksByDate = thisWeeksTasks.reduce((acc, task) => {
        const dateKey = new Date(task.dueDate).toISOString().split('T')[0];
        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(task);
        return acc;
    }, {} as Record<string, Task[]>);

    const getStatusBorder = (status: TaskStatus) => {
        switch (status) {
            case 'open': return 'border-blue-500';
            case 'in-progress': return 'border-yellow-500';
            case 'completed': return 'border-green-500';
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Aufgaben dieser Woche</h2>
            <div className="grid grid-cols-7 gap-2">
                {weekDays.map(day => {
                    const dayKey = day.toISOString().split('T')[0];
                    const isToday = dayKey === todayDateString;
                    const tasksForDay = tasksByDate[dayKey] || [];
                    
                    return (
                        <div key={dayKey} className={`p-2 rounded-lg ${isToday ? 'bg-brand-green-light dark:bg-brand-green-dark/30' : 'bg-gray-50 dark:bg-gray-900/50'}`}>
                            <div className="text-center mb-2">
                                <p className={`font-semibold text-sm ${isToday ? 'text-brand-green-dark dark:text-brand-green-light' : 'text-gray-600 dark:text-gray-400'}`}>
                                    {day.toLocaleDateString('de-DE', { weekday: 'short' })}
                                </p>
                                <p className={`font-bold text-lg ${isToday ? 'text-brand-green-dark dark:text-brand-green-light' : 'text-gray-800 dark:text-gray-200'}`}>
                                    {day.getDate()}
                                </p>
                            </div>
                            <div className="space-y-2 h-48 overflow-y-auto pr-1">
                                {tasksForDay.map(task => (
                                    <div 
                                        key={task.id} 
                                        className={`p-2 rounded-md bg-white dark:bg-gray-800 shadow-sm border-l-4 ${getStatusBorder(task.status)}`}
                                        title={task.title}
                                    >
                                        <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">{task.title}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};


const Dashboard: React.FC = () => {
    const { tasks, clients, bills, employees, getClientById } = useData();

    const openTasksCount = tasks.filter(t => t.status === 'open' || t.status === 'in-progress').length;
    const overdueBillsCount = bills.filter(b => b.status === 'overdue').length;
    
    const todayStr = new Date().toISOString().split('T')[0];
    const todaysTasks = tasks.filter(t => t.dueDate === todayStr);

    const dayKeys: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDayKey = dayKeys[new Date().getDay()];
    const availableTeam = employees.filter(e => e.availability[currentDayKey]);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard 
                    title="Offene Aufgaben" 
                    value={openTasksCount} 
                    color="bg-blue-100"
                    darkColor="dark:bg-blue-900/50"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>} 
                />
                <StatCard 
                    title="Aktive Kunden" 
                    value={clients.length} 
                    color="bg-green-100"
                    darkColor="dark:bg-green-900/50"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                />
                 <StatCard 
                    title="Überfällige Rechnungen" 
                    value={overdueBillsCount} 
                    color="bg-red-100"
                    darkColor="dark:bg-red-900/50"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Heutige Aufgaben</h2>
                    <div className="space-y-4">
                        {todaysTasks.length > 0 ? todaysTasks.map(task => (
                            <TaskRow key={task.id} task={task} client={getClientById(task.clientId)} />
                        )) : <p className="text-gray-500 dark:text-gray-400">Für heute sind keine Aufgaben geplant.</p>}
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Verfügbares Team</h2>
                    <div className="space-y-4">
                       {availableTeam.map(member => (
                           <TeamMemberRow key={member.id} member={member} />
                       ))}
                    </div>
                </div>
            </div>
            
            <WeeklyCalendar />
        </div>
    );
};

export default Dashboard;