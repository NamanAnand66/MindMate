import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useMood } from '../../contexts/MoodContext';
import { format, subDays, isSameDay } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MoodChart = ({ timeRange = 7 }) => {
  const { moodEntries, moodTypes } = useMood();
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    if (!moodEntries.length) return;

    const moodValues = {
      'joyful': 5,
      'calm': 4,
      'neutral': 3,
      'anxious': 2,
      'sad': 1,
      'angry': 0
    };


    const dateLabels = [];
    const today = new Date();
    
    for (let i = timeRange - 1; i >= 0; i--) {
      const date = subDays(today, i);
      dateLabels.push(format(date, 'MMM d'));
    }


    const entriesByDate = {};
    
    moodEntries.forEach(entry => {
      const entryDate = new Date(entry.created_at);
      
      for (let i = 0; i < timeRange; i++) {
        const date = subDays(today, i);
        if (isSameDay(entryDate, date)) {
          const dateStr = format(date, 'MMM d');
          if (!entriesByDate[dateStr]) {
            entriesByDate[dateStr] = [];
          }
          entriesByDate[dateStr].push(entry);
        }
      }
    });


    const moodData = dateLabels.map(label => {
      const entries = entriesByDate[label] || [];
      if (entries.length === 0) return null; 
      
      const sum = entries.reduce((total, entry) => {
        return total + (moodValues[entry.mood] ?? 3); 
      }, 0);
      
      return sum / entries.length;
    });

   
    setChartData({
      labels: dateLabels,
      datasets: [
        {
          label: 'Mood',
          data: moodData,
          borderColor: '#8B5CF6',
          backgroundColor: 'rgba(139, 92, 246, 0.2)',
          tension: 0.3,
          spanGaps: true,
          pointBackgroundColor: '#8B5CF6',
          pointRadius: 4,
          pointHoverRadius: 6
        }
      ]
    });
  }, [moodEntries, timeRange]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed.y;
            let moodLabel = 'No data';
            
            if (value >= 4.5) moodLabel = 'Joyful';
            else if (value >= 3.5) moodLabel = 'Calm';
            else if (value >= 2.5) moodLabel = 'Neutral';
            else if (value >= 1.5) moodLabel = 'Anxious';
            else if (value >= 0.5) moodLabel = 'Sad';
            else if (value >= 0) moodLabel = 'Angry';
            
            return `Mood: ${moodLabel}`;
          }
        }
      }
    },
    scales: {
      y: {
        min: 0,
        max: 5,
        ticks: {
          callback: function(value) {
            const labels = ['Angry', 'Sad', 'Anxious', 'Neutral', 'Calm', 'Joyful'];
            return labels[value] || '';
          },
          stepSize: 1
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 h-80">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Mood Trends
      </h3>
      
      {moodEntries.length === 0 ? (
        <div className="h-56 flex items-center justify-center text-gray-500 dark:text-gray-400">
          <p>No mood data available. Start tracking your mood to see trends.</p>
        </div>
      ) : (
        <div className="h-56">
          <Line data={chartData} options={options} />
        </div>
      )}
    </div>
  );
};

export default MoodChart;
