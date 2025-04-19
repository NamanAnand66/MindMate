import React, { useEffect, useState } from 'react';
import { useMood } from '../../contexts/MoodContext';
import { useTask } from '../../contexts/TaskContext';
import { Heart, Calendar, CheckCircle, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { generateUpliftingMessage } from '../../services/huggingFaceService';

const DailySummary = () => {
  const { moodEntries, moodTypes } = useMood();
  const { tasks } = useTask();
  const [todayMood, setTodayMood] = useState(null);
  const [loading, setLoading] = useState(false);
  const [upliftingMessage, setUpliftingMessage] = useState('');
  
  // Get today's date formatted
  const today = format(new Date(), 'EEEE, MMMM d');
  
  // Find today's mood entry
  useEffect(() => {
    if (moodEntries.length === 0) return;
    
    const todayDate = new Date().toISOString().split('T')[0];
    
    const todayEntry = moodEntries.find(entry => {
      const entryDate = new Date(entry.created_at).toISOString().split('T')[0];
      return entryDate === todayDate;
    });
    
    setTodayMood(todayEntry);
  }, [moodEntries]);
  
  // Generate uplifting message
  useEffect(() => {
    const fetchMessage = async () => {
      try {
        setLoading(true);
        
        // Determine mood context
        let moodContext = 'neutral';
        
        if (todayMood) {
          moodContext = todayMood.mood;
        } else if (moodEntries.length > 0) {
          // If no mood for today, use the most recent mood
          moodContext = moodEntries[0].mood;
        }
        
        const { data, error } = await generateUpliftingMessage(moodContext);
        
        if (!error && data) {
          setUpliftingMessage(data);
        } else {
          setUpliftingMessage("Take a moment to breathe and be kind to yourself today.");
        }
      } catch (err) {
        console.error('Error generating message:', err);
        setUpliftingMessage("Every day is a new opportunity for growth and joy.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessage();
  }, [todayMood, moodEntries]);
  
  // Task stats
  const pendingTasks = tasks.filter(task => !task.completed).length;
  const completedToday = tasks.filter(task => {
    if (!task.completed) return false;
    
    const todayDate = new Date().toISOString().split('T')[0];
    const completedDate = new Date(task.completed_at || task.updated_at).toISOString().split('T')[0];
    
    return completedDate === todayDate;
  }).length;
  
  // Get mood emoji
  const getMoodEmoji = (moodValue) => {
    if (!moodValue) return '😐';
    const mood = moodTypes.find(m => m.value === moodValue);
    return mood ? mood.emoji : '😐';
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-500 dark:from-primary-900 dark:to-primary-800 text-white p-5 rounded-t-lg">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <h2 className="text-lg font-semibold">{today}</h2>
            </div>
            <p className="mt-1 text-primary-100 dark:text-primary-200">Your daily wellness summary</p>
          </div>
          
          {todayMood && (
            <div className="flex items-center bg-white bg-opacity-20 rounded-full px-3 py-1.5">
              <span className="text-xl mr-2" role="img" aria-label={todayMood.mood}>
                {getMoodEmoji(todayMood.mood)}
              </span>
              <span className="font-medium text-sm capitalize">
                {todayMood.mood}
              </span>
            </div>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5 space-y-6">
        {/* Uplifting message */}
        <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 border border-primary-100 dark:border-primary-800">
          <div className="flex items-start">
            <Heart className="h-5 w-5 text-primary-500 mt-1 flex-shrink-0" />
            <p className="ml-3 text-primary-900 dark:text-primary-100 font-medium">
              {loading ? "Generating your daily uplift..." : upliftingMessage}
            </p>
          </div>
        </div>
        
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Mood stats */}
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              Mood Trends
            </h3>
            
            {moodEntries.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                No mood data yet. Start tracking your mood to see trends.
              </p>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300 text-sm">Last mood:</span>
                  <span className="flex items-center">
                    <span className="mr-1 text-lg">{getMoodEmoji(moodEntries[0]?.mood)}</span>
                    <span className="text-gray-900 dark:text-gray-100 capitalize">{moodEntries[0]?.mood}</span>
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300 text-sm">Entries this week:</span>
                  <span className="text-gray-900 dark:text-gray-100">
                    {moodEntries.filter(entry => {
                      const entryDate = new Date(entry.created_at);
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return entryDate >= weekAgo;
                    }).length}
                  </span>
                </div>
              </div>
            )}
          </div>
          
          {/* Task stats */}
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center">
              <CheckCircle className="h-4 w-4 mr-1" />
              Task Progress
            </h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300 text-sm">Pending tasks:</span>
                <span className="text-gray-900 dark:text-gray-100">{pendingTasks}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300 text-sm">Completed today:</span>
                <span className="text-gray-900 dark:text-gray-100">{completedToday}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailySummary;