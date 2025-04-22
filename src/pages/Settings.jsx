import React, { useState } from 'react';
import { useSupabase } from '../contexts/SupabaseContext';
import { useTheme } from '../contexts/ThemeContext';
import { Settings as SettingsIcon, Moon, Sun, Shield, LogOut, Trash2, User } from 'lucide-react';

const Settings = () => {
  const { user, signOut } = useSupabase();
  const { theme, toggleTheme } = useTheme();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const handleSignOut = async () => {
    await signOut();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <SettingsIcon className="h-7 w-7 mr-2 text-primary-500" />
          Settings
        </h1>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow divide-y divide-gray-200 dark:divide-gray-700">
       
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
            <User className="h-5 w-5 mr-2 text-primary-500" />
            Account Information
          </h2>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center">
            <div className="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 h-16 w-16 rounded-full flex items-center justify-center text-2xl font-bold">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            
            <div className="mt-3 sm:mt-0 sm:ml-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
              <p className="text-base font-medium text-gray-900 dark:text-white">{user?.email}</p>
            </div>
          </div>
        </div>
        
        
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
            {theme === 'dark' ? (
              <Moon className="h-5 w-5 mr-2 text-primary-500" />
            ) : (
              <Sun className="h-5 w-5 mr-2 text-primary-500" />
            )}
            Appearance
          </h2>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-medium text-gray-900 dark:text-white">
                Dark Mode
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Toggle between light and dark themes
              </p>
            </div>
            
            <button
              onClick={toggleTheme}
              className={`relative inline-flex items-center h-6 rounded-full w-11 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors ${
                theme === 'dark' ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
              aria-pressed={theme === 'dark'}
            >
              <span className="sr-only">Toggle dark mode</span>
              <span
                className={`${
                  theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
              />
            </button>
          </div>
        </div>
        
        
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
            <Shield className="h-5 w-5 mr-2 text-primary-500" />
            Privacy & Data
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Your data is stored securely in your Supabase database. You can export or delete your data at any time.
          </p>
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Export My Data
            </button>
            
            <button
              type="button"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-error-300 dark:border-error-700 shadow-sm text-sm font-medium rounded-md text-error-700 dark:text-error-300 bg-white dark:bg-gray-800 hover:bg-error-50 dark:hover:bg-error-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-error-500"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete My Account
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <button
            onClick={handleSignOut}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </button>
        </div>
      </div>
      
      
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 animate-fade-in">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Delete your account?
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              This action cannot be undone. All of your data will be permanently deleted.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsDeleteDialogOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-white bg-error-600 rounded-md hover:bg-error-700 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
