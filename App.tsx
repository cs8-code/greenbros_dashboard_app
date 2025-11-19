
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TasksBoard from './components/TasksBoard';
import ClientsList from './components/ClientsList';
import BillsList from './components/BillsList';
import Documents from './components/Documents';
import TeamList from './components/TeamList';
import CalendarView from './components/CalendarView';
import EmailsList from './components/EmailsList';
import Header from './components/Header';
import { DataProvider } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';

export type View = 'dashboard' | 'tasks' | 'clients' | 'documents' | 'team' | 'calendar' | 'emails';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true); // Start open on desktop

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'tasks':
        return <TasksBoard />;
      case 'clients':
        return <ClientsList />;
      case 'documents':
        return <Documents />;
      case 'team':
        return <TeamList />;
      case 'calendar':
        return <CalendarView />;
      case 'emails':
        return <EmailsList />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ThemeProvider>
      <DataProvider>
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 font-sans">
          <Sidebar
            currentView={currentView}
            setCurrentView={setCurrentView}
            isCollapsed={!sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
          />
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