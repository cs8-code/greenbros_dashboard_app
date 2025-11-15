import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Employee, DayOfWeek } from '../types';

const AvailabilityViewer: React.FC<{ availability: Record<DayOfWeek, boolean> }> = ({ availability }) => {
    const days: { key: DayOfWeek, label: string }[] = [
        { key: 'monday', label: 'Mo' },
        { key: 'tuesday', label: 'Di' },
        { key: 'wednesday', label: 'Mi' },
        { key: 'thursday', label: 'Do' },
        { key: 'friday', label: 'Fr' },
        { key: 'saturday', label: 'Sa' },
        { key: 'sunday', label: 'So' },
    ];
    
    const dayKeys: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDayKey = dayKeys[new Date().getDay()];

    return (
        <div className="mt-2">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Wochenverfügbarkeit</span>
            <div className="flex space-x-1.5 mt-1">
                {days.map(day => (
                    <div
                        key={day.key}
                        title={`${day.label}: ${availability[day.key] ? 'Verfügbar' : 'Nicht verfügbar'}`}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold
                        ${availability[day.key] ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 opacity-60'}
                        ${day.key === currentDayKey ? 'ring-2 ring-brand-green-dark dark:ring-brand-green-light' : ''}
                        `}
                    >
                        {day.label}
                    </div>
                ))}
            </div>
        </div>
    );
};


const TeamList: React.FC = () => {
    const { employees, tasks } = useData();
    const [expandedEmployeeId, setExpandedEmployeeId] = useState<string | null>(null);

    const toggleEmployee = (employeeId: string) => {
        setExpandedEmployeeId(prevId => (prevId === employeeId ? null : employeeId));
    };

    const workStatsByEmployee = useMemo(() => {
        const stats: Record<string, { month: string; days: number }[]> = {};

        employees.forEach(employee => {
            const completedTasks = tasks.filter(task =>
                task.status === 'completed' && task.assignedTo.includes(employee.id)
            );

            const monthlyWorkDays: Record<string, Set<string>> = {};

            completedTasks.forEach(task => {
                const date = new Date(task.dueDate);
                const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
                
                if (!monthlyWorkDays[monthKey]) {
                    monthlyWorkDays[monthKey] = new Set();
                }
                monthlyWorkDays[monthKey].add(task.dueDate);
            });

            stats[employee.id] = Object.entries(monthlyWorkDays)
                .map(([monthKey, daysSet]) => {
                    const [year, month] = monthKey.split('-');
                    const monthDate = new Date(parseInt(year), parseInt(month));
                    return {
                        month: monthDate.toLocaleString('de-DE', { month: 'long', year: 'numeric' }),
                        days: daysSet.size,
                        date: monthDate,
                    };
                })
                .sort((a, b) => b.date.getTime() - a.date.getTime());
        });

        return stats;
    }, [employees, tasks]);

    return (
        <div className="space-y-4">
             <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">Unser Team</h2>
            </div>
            {employees.map(member => {
                const workStats = workStatsByEmployee[member.id] || [];
                const isOpen = expandedEmployeeId === member.id;

                return (
                    <div key={member.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                        <button 
                            onClick={() => toggleEmployee(member.id)}
                            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                        >
                            <div className="flex items-center">
                                <img src={member.avatarUrl} alt={member.name} className="w-16 h-16 rounded-full mr-4" />
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">{member.name}</h3>
                                    <p className="text-brand-green-dark dark:text-brand-green-light font-medium">{member.role}</p>
                                    <AvailabilityViewer availability={member.availability} />
                                </div>
                            </div>
                            <div className="flex items-center">
                               <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-gray-500 dark:text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </button>
                        
                        {isOpen && (
                            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Monatliche Arbeitsstatistiken</h4>
                                {workStats.length > 0 ? (
                                    <table className="w-full max-w-sm text-left text-sm">
                                        <thead>
                                            <tr className="border-b-2 border-gray-200 dark:border-gray-600">
                                                <th className="p-2 font-semibold text-gray-600 dark:text-gray-400">Monat</th>
                                                <th className="p-2 font-semibold text-gray-600 dark:text-gray-400 text-right">Arbeitstage</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {workStats.map(stat => (
                                                <tr key={stat.month} className="border-b border-gray-200 dark:border-gray-700">
                                                    <td className="p-2 font-medium text-gray-800 dark:text-gray-200">{stat.month}</td>
                                                    <td className="p-2 text-gray-700 dark:text-gray-300 text-right">{stat.days} Tag(e)</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400 px-2 py-4">Keine abgeschlossenen Aufgaben für diesen Mitarbeiter erfasst.</p>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default TeamList;