import React from 'react';
import { useMood } from '../../contexts/MoodContext';

const MoodSelector = ({ selected, onSelect }) => {
  const { moodTypes } = useMood();
  
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 w-full">
      {moodTypes.map((mood) => (
        <button
          key={mood.value}
          onClick={() => onSelect(mood.value)}
          className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all duration-200 ${
            selected === mood.value 
              ? `ring-2 ring-primary-500 ${mood.color} bg-opacity-20 dark:bg-opacity-30 transform scale-105` 
              : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
          }`}
          aria-pressed={selected === mood.value}
        >
          <span className="text-2xl mb-1" role="img" aria-label={mood.label}>
            {mood.emoji}
          </span>
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {mood.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default MoodSelector;