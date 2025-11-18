
import React from 'react';
import type { View } from '../App';

interface HeaderProps {
  currentView: View;
}

const viewTitles: Record<View, string> = {
    dashboard: 'Dashboard',
    tasks: 'Auftragsplaner',
    clients: 'Kunden',
    bills: 'Dokumente',
    team: 'Team',
    calendar: 'Kalender',
};


const Header: React.FC<HeaderProps> = ({ currentView }) => {
  const title = viewTitles[currentView] || 'Dashboard';
  const today = new Date().toLocaleDateString('de-DE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{title}</h1>
      <div className="text-gray-600 dark:text-gray-400 font-medium hidden sm:block">
        {today}
      </div>
    </header>
  );
};

export default Header;