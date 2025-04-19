import React from 'react';
import DailySummary from '../components/dashboard/DailySummary';
import QuickActions from '../components/dashboard/QuickActions';
import MoodChart from '../components/mood/MoodChart';
import { useSupabase } from '../contexts/SupabaseContext';
import { useMood } from '../contexts/MoodContext';
import { useTask } from '../contexts/TaskContext';

const Dashboard = () => {
  const { user } = useSupabase();
  const { moodEntries } = useMood();
  const { tasks } = useTask();
  
  // Get user's first name from email
  const firstName = user?.email?.split('@')[0] || 'Friend';
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {firstName}
        </h1>
      </div>
      
      <DailySummary />
      
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white pt-2">
        Quick Actions
      </h2>
      <QuickActions />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MoodChart timeRange={7} />
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 h-80 overflow-auto">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Recent Tasks
          </h3>
          
          {tasks.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 h-56 flex items-center justify-center">
              <p>No tasks yet. Add some tasks to get started!</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {tasks.slice(0, 5).map(task => (
                <li 
                  key={task.id}
                  className={`flex items-start p-3 rounded-lg ${
                    task.completed 
                      ? 'bg-gray-50 dark:bg-gray-900/30 line-through text-gray-500 dark:text-gray-400' 
                      : 'bg-gray-50 dark:bg-gray-900/50'
                  }`}
                >
                  <span className={`h-2 w-2 mt-2 rounded-full flex-shrink-0 ${
                    task.completed 
                      ? 'bg-success-500' 
                      : 'bg-warning-500'
                  }`}></span>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {task.description.length > 60 
                          ? task.description.substring(0, 60) + '...' 
                          : task.description}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;