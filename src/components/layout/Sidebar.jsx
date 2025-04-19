import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSupabase } from '../../contexts/SupabaseContext';
import { 
  Home, 
  BookOpen, 
  CheckSquare, 
  BarChart2, 
  Settings, 
  X,
  Heart
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { user } = useSupabase();
  
  // Close sidebar on location change (mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [location, setIsOpen]);
  
  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isOpen && e.target.closest('.sidebar') === null && !e.target.closest('button[aria-label="Toggle sidebar"]')) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('click', handleOutsideClick);
    
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isOpen, setIsOpen]);
  
  if (!user) return null;
  
  const navigationItems = [
    { path: '/', icon: <Home />, label: 'Dashboard' },
    { path: '/journal', icon: <BookOpen />, label: 'Journal' },
    { path: '/tasks', icon: <CheckSquare />, label: 'Tasks' },
    { path: '/insights', icon: <BarChart2 />, label: 'Insights' },
    { path: '/settings', icon: <Settings />, label: 'Settings' },
  ];
  
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`sidebar fixed md:static inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 shadow-lg md:shadow-none transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } flex flex-col h-full mt-16 md:mt-0`}
      >
        {/* Mobile close button */}
        <div className="p-4 md:hidden flex justify-end">
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-4 py-2 space-y-1">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  isActive 
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' 
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700/50'
                }`
              }
              end={item.path === '/'}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <Heart className="h-3 w-3 mr-1 text-accent-500" />
            <span>MindMate © 2025</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;