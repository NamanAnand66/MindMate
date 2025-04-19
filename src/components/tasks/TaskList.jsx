import React from 'react';
import { useTask } from '../../contexts/TaskContext';
import TaskItem from './TaskItem';
import AddTask from './AddTask';
import { CheckSquare } from 'lucide-react';

const TaskList = () => {
  const { tasks, loading, error, fetchTasks } = useTask();
  const [filter, setFilter] = React.useState('all');
  
  // Refresh tasks when filter changes
  React.useEffect(() => {
    let completed = null;
    if (filter === 'completed') completed = true;
    if (filter === 'pending') completed = false;
    
    fetchTasks(completed);
  }, [filter, fetchTasks]);
  
  // Filter tasks based on selected filter
  const filteredTasks = React.useMemo(() => {
    if (filter === 'all') return tasks;
    return tasks.filter(task => 
      filter === 'completed' ? task.completed : !task.completed
    );
  }, [tasks, filter]);
  
  const taskCount = React.useMemo(() => {
    return {
      all: tasks.length,
      completed: tasks.filter(task => task.completed).length,
      pending: tasks.filter(task => !task.completed).length
    };
  }, [tasks]);
  
  if (error) {
    return (
      <div className="p-4 bg-error-50 text-error-700 dark:bg-error-900/30 dark:text-error-300 rounded-lg">
        Error loading tasks: {error}
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <AddTask onAddSuccess={() => fetchTasks()} />
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        {/* Filters */}
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
            <CheckSquare className="h-5 w-5 mr-2 text-primary-500" />
            Your Tasks
          </h3>
          
          <div className="flex space-x-1 text-sm">
            <button 
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-md ${
                filter === 'all' 
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 font-medium' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              All ({taskCount.all})
            </button>
            <button 
              onClick={() => setFilter('pending')}
              className={`px-3 py-1 rounded-md ${
                filter === 'pending' 
                  ? 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-300 font-medium' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Pending ({taskCount.pending})
            </button>
            <button 
              onClick={() => setFilter('completed')}
              className={`px-3 py-1 rounded-md ${
                filter === 'completed' 
                  ? 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300 font-medium' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Completed ({taskCount.completed})
            </button>
          </div>
        </div>
        
        {/* Task list */}
        <div>
          {loading ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              Loading tasks...
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              {filter === 'all' 
                ? "You don't have any tasks yet. Add one above!" 
                : filter === 'completed' 
                  ? "You don't have any completed tasks."
                  : "You don't have any pending tasks."}
            </div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTasks.map(task => (
                <TaskItem key={task.id} task={task} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskList;