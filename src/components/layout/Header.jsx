import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useSupabase } from '../../contexts/SupabaseContext';
import { Brain, Menu, Sun, Moon, LogOut, UserCircle } from 'lucide-react';

const Header = ({ toggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useSupabase();
  const [showDropdown, setShowDropdown] = React.useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 shadow-sm z-10 transition-colors duration-300">
      <div className="h-full px-4 flex items-center justify-between">

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 md:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5 text-gray-700 dark:text-gray-200" />
          </button>
          
          <Link to="/" className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            <span className="text-xl font-semibold text-gray-800 dark:text-white">MindMate</span>
          </Link>
        </div>
        
  
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 text-gray-200" />
            ) : (
              <Moon className="h-5 w-5 text-gray-700" />
            )}
          </button>
          
    
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-1 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="User menu"
              >
                <UserCircle className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                <span className="hidden md:block text-sm text-gray-700 dark:text-gray-200">
                  {user.email?.split('@')[0] || 'User'}
                </span>
              </button>
              
      
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-20">
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setShowDropdown(false)}
                  >
                    Settings
                  </Link>
                  
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      handleSignOut();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="flex items-center space-x-2">
                      <LogOut className="h-4 w-4" />
                      <span>Sign out</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
