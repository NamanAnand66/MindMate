import React, { useState } from 'react';
import { useTask } from '../../contexts/TaskContext';
import { CheckCircle, Circle, Trash2, Tag } from 'lucide-react';
import { format } from 'date-fns';

const TaskItem = ({ task }) => {
  const { toggleTaskCompletion, removeTask } = useTask();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  
  const handleToggleComplete = async () => {
    try {
      setIsCompleting(true);
      await toggleTaskCompletion(task.id);
    } finally {
      setIsCompleting(false);
    }
  };
  
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await removeTask(task.id);
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Get category color
  const getCategoryColor = (category) => {
    const categories = {
      'wellness': 'bg-primary-100 text-primary-800 dark:bg-primary-900/40 dark:text-primary-300',
      'selfcare': 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900/40 dark:text-secondary-300',
      'health': 'bg-success-100 text-success-800 dark:bg-success-900/40 dark:text-success-300',
      'work': 'bg-warning-100 text-warning-800 dark:bg-warning-900/40 dark:text-warning-300',
      'personal': 'bg-accent-100 text-accent-800 dark:bg-accent-900/40 dark:text-accent-300',
    };
    
    return categories[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  };
  
  return (
    <li className={`px-4 py-3 flex items-start transition-colors duration-200 ${
      task.completed ? 'bg-gray-50 dark:bg-gray-900/30' : ''
    } hover:bg-gray-50 dark:hover:bg-gray-750`}>
      <button
        onClick={handleToggleComplete}
        disabled={isCompleting}
        className={`mt-1 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full ${
          isCompleting ? 'opacity-50 cursor-wait' : ''
        }`}
        aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
      >
        {task.completed ? (
          <CheckCircle className="h-5 w-5 text-success-500 dark:text-success-400" />
        ) : (
          <Circle className="h-5 w-5 text-gray-400 hover:text-primary-500 dark:text-gray-600 dark:hover:text-primary-400" />
        )}
      </button>
      
      <div className="ml-3 flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className={`font-medium ${
              task.completed 
                ? 'line-through text-gray-500 dark:text-gray-400' 
                : 'text-gray-800 dark:text-white'
            }`}>
              {task.title}
            </span>
            
            {task.category && (
              <span className={`ml-2 text-xs px-2 py-0.5 rounded-full flex items-center ${getCategoryColor(task.category)}`}>
                <Tag className="h-3 w-3 mr-1" />
                {task.category}
              </span>
            )}
          </div>
          
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`text-gray-400 hover:text-error-500 dark:text-gray-600 dark:hover:text-error-400 focus:outline-none focus:ring-2 focus:ring-error-500 rounded-full p-1 ${
              isDeleting ? 'opacity-50 cursor-wait' : ''
            }`}
            aria-label="Delete task"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        
        {task.description && (
          <p className={`text-sm mt-1 ${
            task.completed 
              ? 'text-gray-400 dark:text-gray-500' 
              : 'text-gray-600 dark:text-gray-300'
          }`}>
            {task.description}
          </p>
        )}
        
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {task.completed ? (
            <span>Completed {format(new Date(task.completed_at || task.updated_at), 'MMM d, yyyy')}</span>
          ) : (
            <span>Created {format(new Date(task.created_at), 'MMM d, yyyy')}</span>
          )}
        </div>
      </div>
    </li>
  );
};

export default TaskItem;