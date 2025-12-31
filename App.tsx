
import React, { useState, useEffect } from 'react';
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
  // Persist current view to localStorage to survive remounts
  const [currentView, setCurrentView] = useState<View>(() => {
    const saved = localStorage.getItem('currentView') as View | null;
    console.log('🔄 Initializing App, saved view:', saved);
    return saved || 'dashboard';
  });

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true); // Start open on desktop

  // Debug wrapper for setCurrentView
  const debugSetCurrentView = (view: View) => {
    console.log('🔍 setCurrentView called:', view);
    console.trace('Call stack:');
    localStorage.setItem('currentView', view);
    setCurrentView(view);
  };

  // Track component mount/unmount
  useEffect(() => {
    console.log('✅ App component mounted');
    console.log('Stack trace for mount:');
    console.trace();
    return () => {
      console.log('❌ App component unmounting');
      console.log('Stack trace for unmount:');
      console.trace();
    };
  }, []);

  // Track view changes
  useEffect(() => {
    console.log('📍 Current view changed to:', currentView);
  }, [currentView]);

  const renderView = () => {
    const handleViewClick = (e: React.MouseEvent) => {
      console.log('🛡️ View wrapper clicked, stopping propagation');
      e.stopPropagation();
      if (e.nativeEvent) {
        e.nativeEvent.stopImmediatePropagation();
        e.nativeEvent.stopPropagation();
      }
    };

    const viewContent = (() => {
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
    })();

    return (
      <div onClick={handleViewClick} style={{ width: '100%', height: '100%' }}>
        {viewContent}
      </div>
    );
  };

  return (
    <ThemeProvider>
      <DataProvider>
        <div
          className="flex h-screen bg-gray-100 dark:bg-gray-900 font-sans"
          style={{ overflow: 'hidden' }}
        >
          <Sidebar
            currentView={currentView}
            setCurrentView={debugSetCurrentView}
            isCollapsed={!sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
          />
          <div
            className="flex-1 flex flex-col overflow-hidden"
            style={{
              position: 'relative',
              zIndex: 20,
              minWidth: 0,
              flex: '1 1 0%'
            }}
            onClick={(e) => {
              console.log('🎯 Main content area clicked');
              e.stopPropagation();
            }}
          >
            <Header currentView={currentView} />
            <main
              className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-800 p-4 md:p-6 lg:p-8"
              onClick={(e) => {
                console.log('📄 Main element clicked');
                e.stopPropagation();
              }}
            >
              {renderView()}
            </main>
          </div>
        </div>
      </DataProvider>
    </ThemeProvider>
  );
};

export default App;