import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSupabase } from './SupabaseContext';
import { getTasks, createTask, updateTask, deleteTask } from '../services/supabaseClient';

const TaskContext = createContext();

export const useTask = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const { user } = useSupabase();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch tasks for the logged-in user
  const fetchTasks = async (completed = null) => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await getTasks(user.id, completed);
      
      if (error) throw error;
      
      setTasks(data || []);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add a new task
  const addTask = async (title, description = '', category = 'wellness') => {
    if (!user) return { error: 'User not logged in' };
    
    try {
      setLoading(true);
      setError(null);
      
      const taskData = {
        user_id: user.id,
        title,
        description,
        category,
        completed: false,
        created_at: new Date().toISOString(),
      };
      
      const { data, error } = await createTask(taskData);
      
      if (error) throw error;
      
      // Update the local state with the new task
      setTasks(prev => [data[0], ...prev]);
      
      return { data: data[0], error: null };
    } catch (err) {
      console.error('Error adding task:', err);
      setError(err.message);
      return { data: null, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Toggle task completion status
  const toggleTaskCompletion = async (taskId) => {
    try {
      setLoading(true);
      setError(null);
      
      // Find the task
      const task = tasks.find(t => t.id === taskId);
      
      if (!task) {
        throw new Error('Task not found');
      }
      
      // Update the task
      const { data, error } = await updateTask(taskId, {
        completed: !task.completed,
        completed_at: !task.completed ? new Date().toISOString() : null,
      });
      
      if (error) throw error;
      
      // Update local state
      setTasks(prev => 
        prev.map(t => t.id === taskId ? data[0] : t)
      );
      
      return { data: data[0], error: null };
    } catch (err) {
      console.error('Error toggling task completion:', err);
      setError(err.message);
      return { data: null, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Remove a task
  const removeTask = async (taskId) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await deleteTask(taskId);
      
      if (error) throw error;
      
      // Update local state
      setTasks(prev => prev.filter(t => t.id !== taskId));
      
      return { error: null };
    } catch (err) {
      console.error('Error removing task:', err);
      setError(err.message);
      return { error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Get task completion statistics
  const getTaskStats = () => {
    if (!tasks.length) return {};
    
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const completionRate = (completedTasks / totalTasks) * 100;
    
    // Group by category
    const categories = tasks.reduce((acc, task) => {
      const category = task.category || 'uncategorized';
      
      if (!acc[category]) {
        acc[category] = {
          total: 0,
          completed: 0,
        };
      }
      
      acc[category].total += 1;
      if (task.completed) {
        acc[category].completed += 1;
      }
      
      return acc;
    }, {});
    
    return {
      total: totalTasks,
      completed: completedTasks,
      pending: totalTasks - completedTasks,
      completionRate,
      categories,
    };
  };

  // Load tasks when user changes
  useEffect(() => {
    if (user) {
      fetchTasks();
    } else {
      setTasks([]);
    }
  }, [user]);

  const value = {
    tasks,
    loading,
    error,
    fetchTasks,
    addTask,
    toggleTaskCompletion,
    removeTask,
    getTaskStats,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};