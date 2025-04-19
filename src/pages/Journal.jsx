import React, { useState } from 'react';
import JournalEntry from '../components/mood/JournalEntry';
import MoodAnalysis from '../components/mood/MoodAnalysis';
import MoodChart from '../components/mood/MoodChart';
import { format } from 'date-fns';
import { useMood } from '../contexts/MoodContext';
import { Clock, BookOpen } from 'lucide-react';

const Journal = () => {
  const { moodEntries } = useMood();
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  
  const handleEntrySubmitted = (entry, aiResults) => {
    if (aiResults && (aiResults.sentiment || aiResults.emotion || aiResults.wellnessTip)) {
      setCurrentAnalysis(aiResults);
      setShowAnalysis(true);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <BookOpen className="h-7 w-7 mr-2 text-primary-500" />
          Your Mood Journal
        </h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <JournalEntry onEntrySubmitted={handleEntrySubmitted} />
          
          {showAnalysis && currentAnalysis && (
            <MoodAnalysis analysis={currentAnalysis} />
          )}
        </div>
        
        <div className="w-full">
          <MoodChart timeRange={7} />
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Recent Journal Entries
          </h2>
        </div>
        
        {moodEntries.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <p>No journal entries yet. Start tracking your mood!</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {moodEntries.slice(0, 5).map(entry => (
              <li key={entry.id} className="p-5 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-200">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-1">
                    <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-xl">
                      {entry.mood === 'joyful' ? '😄' :
                       entry.mood === 'calm' ? '😌' :
                       entry.mood === 'neutral' ? '😐' :
                       entry.mood === 'anxious' ? '😟' :
                       entry.mood === 'sad' ? '😢' :
                       entry.mood === 'angry' ? '😠' : '😐'}
                    </div>
                  </div>
                  
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-md font-medium text-gray-900 dark:text-white capitalize">
                        {entry.mood}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="h-3 w-3 mr-1" />
                        {format(new Date(entry.created_at), 'MMM d, yyyy h:mm a')}
                      </div>
                    </div>
                    
                    {entry.journal_text && (
                      <p className="mt-2 text-gray-600 dark:text-gray-300">
                        {entry.journal_text.length > 150 
                          ? entry.journal_text.substring(0, 150) + '...' 
                          : entry.journal_text}
                      </p>
                    )}
                    
                    {entry.wellness_tip && (
                      <div className="mt-3 p-3 bg-primary-50 dark:bg-primary-900/20 text-sm text-primary-700 dark:text-primary-300 rounded-md">
                        <span className="font-medium">Wellness Tip:</span> {entry.wellness_tip}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Journal;