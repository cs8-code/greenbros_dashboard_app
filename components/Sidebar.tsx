
import React from 'react';
import type { View } from '../App';
import { useTheme } from '../context/ThemeContext';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

const LeafIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.121 14.121a6 6 0 10-8.484-8.484 6 6 0 008.484 8.484zM12 12L9 9m3 3l3 3m-3-3l-3 3m3-3l3-3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.66-14.66l-.707.707M4.05 19.95l-.707.707M21 12h-1M4 12H3m16.243-7.243l-.707-.707M4.757 4.757l-.707-.707" />
    </svg>
);

const NavIcon: React.FC<{ icon: React.ReactNode }> = ({ icon }) => <>{icon}</>;

const ThemeToggle: React.FC<{ isCollapsed?: boolean }> = ({ isCollapsed = false }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="p-2">
             <button
                onClick={toggleTheme}
                className="w-full flex items-center justify-center p-2 rounded-lg bg-black/20 hover:bg-black/40 transition-colors"
                aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                title={isCollapsed ? (theme === 'light' ? 'Dark Mode' : 'Light Mode') : ''}
            >
                {theme === 'light' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 18v-1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                )}
            </button>
        </div>
    );
};


const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, isCollapsed, onToggle }) => {
  const sidebarRef = React.useRef<HTMLElement>(null);

  const navItems: { view: View; label: string; icon: React.ReactNode }[] = [
    { view: 'dashboard', label: 'Dashboard', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
    { view: 'tasks', label: 'Aufträge', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg> },
    { view: 'clients', label: 'Kunden', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
    { view: 'emails', label: 'Emails', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
    { view: 'documents', label: 'Dokumente', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
    { view: 'team', label: 'Team', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg> },
    { view: 'calendar', label: 'Kalender', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
  ];

  return (
    <nav
      ref={sidebarRef}
      className={`
        bg-brand-green dark:bg-gray-900 text-white
        flex flex-col p-4
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-64'}
      `}
      style={{
        position: 'relative',
        zIndex: 10,
        flexShrink: 0,
        maxWidth: isCollapsed ? '5rem' : '16rem',
        minWidth: isCollapsed ? '5rem' : '16rem',
        overflow: 'hidden',
        contain: 'layout style paint'
      }}
    >
      {/* Header with Logo and Toggle */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div className={`flex items-center ${isCollapsed ? 'justify-center w-full' : ''}`}>
          {!isCollapsed && <LeafIcon />}
          {!isCollapsed && <h1 className="text-2xl font-bold ml-2">TheGreenBros</h1>}
          {isCollapsed && <LeafIcon />}
        </div>
        {!isCollapsed && (
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg hover:bg-black/20 transition-colors"
            aria-label="Collapse sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        )}
      </div>

      {/* Expand button when collapsed */}
      {isCollapsed && (
        <button
          onClick={onToggle}
          className="mb-4 p-2 rounded-lg hover:bg-black/20 transition-colors flex justify-center"
          aria-label="Expand sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Navigation Items */}
      <ul
        className="flex-grow space-y-1"
        style={{
          flexShrink: 0,
          maxWidth: '100%',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {navItems.map(item => (
          <li
            key={item.view}
            onClick={(e) => {
              // Check if click actually happened within the Sidebar's boundaries
              if (sidebarRef.current) {
                const rect = sidebarRef.current.getBoundingClientRect();
                const clickX = e.clientX;
                const clickY = e.clientY;

                const isWithinSidebar = (
                  clickX >= rect.left &&
                  clickX <= rect.right &&
                  clickY >= rect.top &&
                  clickY <= rect.bottom
                );

                console.log('🧭 Nav item clicked:', item.view);
                console.log('Click position:', { x: clickX, y: clickY });
                console.log('Sidebar bounds:', rect);
                console.log('Is within sidebar?', isWithinSidebar);

                if (!isWithinSidebar) {
                  console.log('❌ Click was outside sidebar bounds, ignoring');
                  e.stopPropagation();
                  return;
                }
              }

              console.log('✅ Valid sidebar click, changing view to:', item.view);
              e.stopPropagation();
              setCurrentView(item.view);
            }}
            className={`
              flex items-center px-3 py-3 rounded-lg cursor-pointer
              transition-colors duration-200
              ${currentView === item.view
                ? 'bg-brand-green-dark text-white'
                : 'text-gray-200 hover:bg-brand-green-dark/50 hover:text-white dark:text-gray-300 dark:hover:bg-gray-700'
              }
              ${isCollapsed ? 'justify-center' : ''}
            `}
            style={{
              flexShrink: 0,
              width: '100%',
              maxWidth: '100%'
            }}
            title={isCollapsed ? item.label : ''}
          >
            <NavIcon icon={item.icon} />
            {!isCollapsed && <span className="ml-4">{item.label}</span>}
          </li>
        ))}
      </ul>

      {/* Theme Toggle */}
      <div className="mt-auto">
        <ThemeToggle isCollapsed={isCollapsed} />
      </div>
    </nav>
  );
};

export default Sidebar;