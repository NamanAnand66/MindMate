import React from 'react';
import TaskList from '../components/tasks/TaskList';
import { CheckSquare } from 'lucide-react';

const Tasks = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <CheckSquare className="h-7 w-7 mr-2 text-primary-500" />
          Wellness Tasks
        </h1>
      </div>
      
      <TaskList />
    </div>
  );
};

export default Tasks;