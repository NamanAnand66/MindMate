import React, { useState } from 'react';
import { useMood } from '../../contexts/MoodContext';
import MoodSelector from './MoodSelector';
import { Loader, Send } from 'lucide-react';

const JournalEntry = ({ onEntrySubmitted }) => {
  const { addMoodEntry, loading } = useMood();
  const [mood, setMood] = useState('');
  const [journalText, setJournalText] = useState('');
  const [useAI, setUseAI] = useState(true);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    

    if (!mood) {
      setError('Please select a mood');
      return;
    }
    
    try {
      const { data, aiResults, error } = await addMoodEntry(mood, journalText, useAI);
      
      if (error) {
        setError(error);
        return;
      }
      
     
      setMood('');
      setJournalText('');
      
     
      if (onEntrySubmitted) {
        onEntrySubmitted(data, aiResults);
      }
    } catch (err) {
      setError('Failed to save journal entry. Please try again.');
      console.error('Error submitting entry:', err);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 animate-fade-in">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        How are you feeling today?
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-error-50 text-error-700 dark:bg-error-900/30 dark:text-error-300 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select your mood
          </label>
          <MoodSelector selected={mood} onSelect={setMood} />
        </div>
        
        <div className="mb-5">
          <label htmlFor="journalText" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Journal your thoughts (optional)
          </label>
          <textarea
            id="journalText"
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            placeholder="Write about how you're feeling today..."
            className="w-full h-32 p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-900 dark:text-white transition-colors duration-200"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5">
          <div className="flex items-center mb-3 sm:mb-0">
            <input
              type="checkbox"
              id="useAI"
              checked={useAI}
              onChange={(e) => setUseAI(e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded transition-colors duration-200"
            />
            <label htmlFor="useAI" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Use AI to analyze my entry and suggest tips
            </label>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading || !mood}
          className={`w-full flex items-center justify-center px-4 py-3 bg-primary-600 text-white rounded-lg font-medium transition-colors duration-200 ${
            loading || !mood
              ? 'opacity-70 cursor-not-allowed'
              : 'hover:bg-primary-700 active:bg-primary-800'
          }`}
        >
          {loading ? (
            <>
              <Loader className="animate-spin h-5 w-5 mr-2" />
              Analyzing...
            </>
          ) : (
            <>
              <Send className="h-5 w-5 mr-2" />
              Submit Entry
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default JournalEntry;
