
import React, { useState } from 'react';
import { useData } from '../context/DataContext';

const CalendarView: React.FC = () => {
    const { tasks } = useData();
    const [currentDate, setCurrentDate] = useState(new Date());

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    // Adjust to start week on Monday for German locale
    const startDayOfWeek = startOfMonth.getDay(); // 0=Sun, 1=Mon, ...
    const dayOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

    const startDate = new Date(startOfMonth);
    startDate.setDate(startDate.getDate() - dayOffset);

    const days = [];
    let day = new Date(startDate);
    
    // Create a 6-week (42 days) grid for consistent layout
    for (let i = 0; i < 42; i++) {
        days.push(new Date(day));
        day.setDate(day.getDate() + 1);
    }

    const tasksByDate: { [key: string]: typeof tasks } = {};
    tasks.forEach(task => {
        const dateKey = new Date(task.dueDate).toDateString();
        if (!tasksByDate[dateKey]) {
            tasksByDate[dateKey] = [];
        }
        tasksByDate[dateKey].push(task);
    });

    const changeMonth = (offset: number) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300" aria-label="Vorheriger Monat">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                    {currentDate.toLocaleString('de-DE', { month: 'long', year: 'numeric' })}
                </h2>
                <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300" aria-label="Nächster Monat">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center font-semibold text-gray-600 dark:text-gray-400">
                {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(d => <div key={d} className="py-2">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {days.map((d, i) => {
                    const isCurrentMonth = d.getMonth() === currentDate.getMonth();
                    const isToday = d.toDateString() === new Date().toDateString();
                    const tasksForDay = tasksByDate[d.toDateString()] || [];

                    return (
                        <div key={i} className={`h-28 border border-gray-200 dark:border-gray-700 p-2 ${isCurrentMonth ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-800/50'}`}>
                            <div className={`w-7 h-7 flex items-center justify-center rounded-full text-sm ${isToday ? 'bg-brand-green text-white' : ''} ${isCurrentMonth ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}`}>
                                {d.getDate()}
                            </div>
                            <div className="mt-1 space-y-1 overflow-y-auto max-h-16">
                                {tasksForDay.map(task => (
                                    <div key={task.id} className="bg-brand-green-light text-brand-green-dark dark:bg-brand-green-dark/50 dark:text-brand-green-light text-xs p-1 rounded truncate" title={task.title}>
                                        {task.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarView;