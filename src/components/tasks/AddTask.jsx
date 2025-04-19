import React, { useState } from 'react';
import { useTask } from '../../contexts/TaskContext';
import { Plus, X } from 'lucide-react';

const AddTask = ({ onAddSuccess }) => {
  const { addTask } = useTask();
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('wellness');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const categories = [
    { value: 'wellness', label: 'Wellness' },
    { value: 'selfcare', label: 'Self Care' },
    { value: 'health', label: 'Health' },
    { value: 'work', label: 'Work' },
    { value: 'personal', label: 'Personal' },
  ];
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('wellness');
    setError('');
  };
  
  const handleAddTask = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const { data, error } = await addTask(title, description, category);
      
      if (error) {
        setError(error);
        return;
      }
      
      resetForm();
      
      if (!isExpanded) {
        setIsExpanded(false);
      }
      
      if (onAddSuccess) {
        onAddSuccess(data);
      }
    } catch (err) {
      setError('Failed to add task. Please try again.');
      console.error('Error adding task:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      {isExpanded ? (
        <form onSubmit={handleAddTask} className="animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Add New Task
            </h3>
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
              aria-label="Close form"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {error && (
            <div className="mb-3 p-2 bg-error-50 text-error-700 dark:bg-error-900/30 dark:text-error-300 rounded text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="task-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Task Title *
              </label>
              <input
                type="text"
                id="task-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What do you want to accomplish?"
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-900 dark:text-white transition-colors duration-200"
                required
              />
            </div>
            
            <div>
              <label htmlFor="task-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description (optional)
              </label>
              <textarea
                id="task-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add details about this task..."
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-900 dark:text-white transition-colors duration-200 h-20"
              />
            </div>
            
            <div>
              <label htmlFor="task-category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                id="task-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-900 dark:text-white transition-colors duration-200"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setIsExpanded(false);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !title.trim()}
                className={`px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md transition-colors duration-200 ${
                  loading || !title.trim()
                    ? 'opacity-70 cursor-not-allowed'
                    : 'hover:bg-primary-700 active:bg-primary-800'
                }`}
              >
                {loading ? 'Adding...' : 'Add Task'}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full flex items-center justify-center space-x-2 p-3 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-500 dark:hover:border-primary-500 transition-colors duration-200"
        >
          <Plus className="h-5 w-5" />
          <span className="font-medium">Add New Task</span>
        </button>
      )}
    </div>
  );
};

export default AddTask;