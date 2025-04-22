import React, { useState, useEffect } from 'react';
import { useMood } from '../contexts/MoodContext';
import { useTask } from '../contexts/TaskContext';
import { BarChart2, Calendar, Sparkles, TrendingUp, PieChart, CheckSquare } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';


ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Insights = () => {
  const { moodEntries, moodTypes } = useMood();
  const { tasks } = useTask();
  const [timeRange, setTimeRange] = useState(30);
  
  
  const [moodDistribution, setMoodDistribution] = useState({
    labels: [],
    datasets: []
  });
  
 
  const [taskCompletionData, setTaskCompletionData] = useState({
    labels: [],
    datasets: []
  });
  
  
  const [moodVsTasksData, setMoodVsTasksData] = useState([]);
  

  useEffect(() => {
    if (!moodEntries.length) return;
    
    const cutoffDate = subDays(new Date(), timeRange);
    const filteredEntries = moodEntries.filter(entry => 
      new Date(entry.created_at) >= cutoffDate
    );
    
  
    const moodCounts = {};
    const moodLabels = [];
    const moodColors = [];
    
    moodTypes.forEach(type => {
      moodCounts[type.value] = 0;
      moodLabels.push(type.label);
      
     
      let color = '';
      if (type.color.includes('success')) color = 'rgba(34, 197, 94, 0.8)';
      else if (type.color.includes('primary')) color = 'rgba(139, 92, 246, 0.8)';
      else if (type.color.includes('warning')) color = 'rgba(245, 158, 11, 0.8)';
      else if (type.color.includes('accent')) color = 'rgba(236, 72, 153, 0.8)';
      else if (type.color.includes('error')) color = 'rgba(239, 68, 68, 0.8)';
      else color = 'rgba(156, 163, 175, 0.8)';
      
      moodColors.push(color);
    });
    
    filteredEntries.forEach(entry => {
      if (moodCounts[entry.mood] !== undefined) {
        moodCounts[entry.mood]++;
      }
    });
    
    const moodData = Object.values(moodCounts);
    
    setMoodDistribution({
      labels: moodLabels,
      datasets: [
        {
          data: moodData,
          backgroundColor: moodColors,
          borderColor: moodColors.map(color => color.replace('0.8', '1')),
          borderWidth: 1,
        },
      ],
    });
  }, [moodEntries, moodTypes, timeRange]);
  
  
  useEffect(() => {
    if (!tasks.length) return;
    
    
    const cutoffDate = subDays(new Date(), timeRange);
    const filteredTasks = tasks.filter(task => 
      new Date(task.created_at) >= cutoffDate
    );
    
   
    const categories = {};
    
    filteredTasks.forEach(task => {
      const category = task.category || 'other';
      
      if (!categories[category]) {
        categories[category] = {
          total: 0,
          completed: 0
        };
      }
      
      categories[category].total++;
      if (task.completed) {
        categories[category].completed++;
      }
    });
    
    const categoryLabels = Object.keys(categories);
    const completedData = categoryLabels.map(label => categories[label].completed);
    const pendingData = categoryLabels.map(label => categories[label].total - categories[label].completed);
    
    setTaskCompletionData({
      labels: categoryLabels.map(cat => cat.charAt(0).toUpperCase() + cat.slice(1)),
      datasets: [
        {
          label: 'Completed',
          data: completedData,
          backgroundColor: 'rgba(34, 197, 94, 0.8)',
          borderColor: 'rgba(34, 197, 94, 1)',
          borderWidth: 1,
        },
        {
          label: 'Pending',
          data: pendingData,
          backgroundColor: 'rgba(245, 158, 11, 0.8)',
          borderColor: 'rgba(245, 158, 11, 1)',
          borderWidth: 1,
        }
      ],
    });
  }, [tasks, timeRange]);
  
  
  useEffect(() => {
    if (!moodEntries.length || !tasks.length) return;
    
    
    const entriesByDate = {};
    const tasksByDate = {};
    
    
    moodEntries.forEach(entry => {
      const date = new Date(entry.created_at).toISOString().split('T')[0];
      
      if (!entriesByDate[date]) {
        entriesByDate[date] = [];
      }
      
      entriesByDate[date].push(entry);
    });
    
    
    tasks.forEach(task => {
      if (!task.completed || !task.completed_at) return;
      
      const date = new Date(task.completed_at).toISOString().split('T')[0];
      
      if (!tasksByDate[date]) {
        tasksByDate[date] = [];
      }
      
      tasksByDate[date].push(task);
    });
    
    
    const correlationData = [];
    
    Object.keys(entriesByDate).forEach(date => {
      if (tasksByDate[date]) {
        const moodValues = {
          'joyful': 5,
          'calm': 4,
          'neutral': 3,
          'anxious': 2,
          'sad': 1,
          'angry': 0
        };
        
        
        const avgMood = entriesByDate[date].reduce((sum, entry) => {
          return sum + (moodValues[entry.mood] || 3);
        }, 0) / entriesByDate[date].length;
        
        
        const completedTaskCount = tasksByDate[date].length;
        
        correlationData.push({
          date,
          avgMood,
          completedTaskCount,
          formattedDate: format(new Date(date), 'MMM d')
        });
      }
    });
    
    
    correlationData.sort((a, b) => new Date(b.date) - new Date(a.date));
    setMoodVsTasksData(correlationData.slice(0, timeRange));
  }, [moodEntries, tasks, timeRange]);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <BarChart2 className="h-7 w-7 mr-2 text-primary-500" />
          Wellness Insights
        </h1>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Time range:</span>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(Number(e.target.value))}
            className="p-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>
      </div>
      
     
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <PieChart className="h-5 w-5 mr-2 text-primary-500" />
            Mood Distribution
          </h3>
          
          {moodEntries.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
              <p>No mood data available. Start tracking your mood to see insights.</p>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <Pie 
                data={moodDistribution} 
                options={{
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        padding: 20,
                        usePointStyle: true,
                      },
                    },
                  },
                  maintainAspectRatio: false,
                }}
              />
            </div>
          )}
        </div>
        
       
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <CheckSquare className="h-5 w-5 mr-2 text-primary-500" />
            Task Completion by Category
          </h3>
          
          {tasks.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
              <p>No task data available. Start adding tasks to see insights.</p>
            </div>
          ) : (
            <div className="h-64">
              <Bar 
                data={taskCompletionData} 
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                  scales: {
                    x: {
                      stacked: false,
                    },
                    y: {
                      stacked: false,
                      beginAtZero: true,
                    },
                  },
                  maintainAspectRatio: false,
                }}
              />
            </div>
          )}
        </div>
      </div>
      
  
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-primary-500" />
            Correlation Insights
          </h2>
        </div>
        
        <div className="p-5">
          {moodVsTasksData.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <p>No correlation data available yet. Track both moods and tasks to see relationships.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-gray-700 dark:text-gray-300">
                We've analyzed your mood entries and task completions to identify patterns that might help improve your wellbeing.
              </p>
              
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Mood
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Tasks Completed
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Correlation
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {moodVsTasksData.slice(0, 7).map((item, index) => {
          
                      let moodLabel = 'Neutral';
                      if (item.avgMood >= 4.5) moodLabel = 'Joyful';
                      else if (item.avgMood >= 3.5) moodLabel = 'Calm';
                      else if (item.avgMood >= 2.5) moodLabel = 'Neutral';
                      else if (item.avgMood >= 1.5) moodLabel = 'Anxious';
                      else if (item.avgMood >= 0.5) moodLabel = 'Sad';
                      else if (item.avgMood >= 0) moodLabel = 'Angry';
                      
                      
                      let moodEmoji = '😐';
                      if (moodLabel === 'Joyful') moodEmoji = '😄';
                      else if (moodLabel === 'Calm') moodEmoji = '😌';
                      else if (moodLabel === 'Neutral') moodEmoji = '😐';
                      else if (moodLabel === 'Anxious') moodEmoji = '😟';
                      else if (moodLabel === 'Sad') moodEmoji = '😢';
                      else if (moodLabel === 'Angry') moodEmoji = '😠';
                      
                    
                      let correlation = '';
                      if (item.avgMood >= 3.5 && item.completedTaskCount >= 2) {
                        correlation = 'Strong positive';
                      } else if (item.avgMood >= 3 && item.completedTaskCount >= 1) {
                        correlation = 'Positive';
                      } else if (item.avgMood < 3 && item.completedTaskCount === 0) {
                        correlation = 'Negative';
                      } else {
                        correlation = 'Neutral';
                      }
                      
                      return (
                        <tr key={index}>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                              {item.formattedDate}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                            <div className="flex items-center">
                              <span className="mr-2" role="img" aria-label={moodLabel}>
                                {moodEmoji}
                              </span>
                              {moodLabel}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                            {item.completedTaskCount}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              correlation === 'Strong positive'
                                ? 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300'
                                : correlation === 'Positive'
                                  ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300'
                                  : correlation === 'Negative'
                                    ? 'bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-300'
                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                            }`}>
                              {correlation}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 border border-primary-100 dark:border-primary-800">
                <div className="flex items-start">
                  <TrendingUp className="h-5 w-5 text-primary-500 mt-1 flex-shrink-0" />
                  <div className="ml-3">
                    <h4 className="font-medium text-primary-900 dark:text-primary-100">
                      Key Insight
                    </h4>
                    <p className="mt-1 text-primary-800 dark:text-primary-200 text-sm">
                      {moodVsTasksData.some(item => item.avgMood >= 3.5 && item.completedTaskCount >= 2)
                        ? "There appears to be a positive correlation between task completion and improved mood. Consider setting daily wellness tasks to help maintain a positive mindset."
                        : moodVsTasksData.some(item => item.avgMood < 3 && item.completedTaskCount === 0)
                          ? "On days when you complete fewer tasks, your mood tends to be lower. Consider breaking larger tasks into smaller, more manageable steps."
                          : "We're still gathering data to identify strong patterns between your mood and task completion. Continue tracking to unlock more personalized insights."
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Insights;
