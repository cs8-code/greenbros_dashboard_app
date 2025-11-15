
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TasksBoard from './components/TasksBoard';
import ClientsList from './components/ClientsList';
import BillsList from './components/BillsList';
import TeamList from './components/TeamList';
import CalendarView from './components/CalendarView';
import Header from './components/Header';
import { DataProvider } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';

export type View = 'dashboard' | 'tasks' | 'clients' | 'bills' | 'team' | 'calendar';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'tasks':
        return <TasksBoard />;
      case 'clients':
        return <ClientsList />;
      case 'bills':
        return <BillsList />;
      case 'team':
        return <TeamList />;
      case 'calendar':
        return <CalendarView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ThemeProvider>
      <DataProvider>
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 font-sans">
          <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header currentView={currentView} />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-800 p-4 md:p-6 lg:p-8">
              {renderView()}
            </main>
          </div>
        </div>
      </DataProvider>
    </ThemeProvider>
  );
};

export default App;