import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSupabase } from './SupabaseContext';
import { getMoodEntries, createMoodEntry } from '../services/supabaseClient';
import { analyzeSentiment, analyzeEmotion, generateWellnessTip } from '../services/huggingFaceService';

const MoodContext = createContext();

export const useMood = () => useContext(MoodContext);

export const MoodProvider = ({ children }) => {
  const { user } = useSupabase();
  const [moodEntries, setMoodEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const moodTypes = [
    { value: 'joyful', emoji: '😄', label: 'Joyful', color: 'bg-success-500' },
    { value: 'calm', emoji: '😌', label: 'Calm', color: 'bg-primary-400' },
    { value: 'neutral', emoji: '😐', label: 'Neutral', color: 'bg-gray-400' },
    { value: 'anxious', emoji: '😟', label: 'Anxious', color: 'bg-warning-500' },
    { value: 'sad', emoji: '😢', label: 'Sad', color: 'bg-accent-400' },
    { value: 'angry', emoji: '😠', label: 'Angry', color: 'bg-error-500' },
  ];


  const fetchMoodEntries = async (startDate, endDate) => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await getMoodEntries(user.id, startDate, endDate);
      
      if (error) throw error;
      
      setMoodEntries(data || []);
    } catch (err) {
      console.error('Error fetching mood entries:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const addMoodEntry = async (mood, journalText = '', aiAnalysis = false) => {
    if (!user) return { error: 'User not logged in' };
    
    try {
      setLoading(true);
      setError(null);
      
      let sentimentResult = null;
      let emotionResult = null;
      let wellnessTip = null;
      

      if (aiAnalysis && journalText) {

        const { data: sentimentData, error: sentimentError } = await analyzeSentiment(journalText);
        if (!sentimentError) {
          sentimentResult = sentimentData;
        }
        

        const { data: emotionData, error: emotionError } = await analyzeEmotion(journalText);
        if (!emotionError) {
          emotionResult = emotionData;
        }
        

        const { data: tipData, error: tipError } = await generateWellnessTip(journalText);
        if (!tipError) {
          wellnessTip = tipData;
        }
      }
      

      const moodEntry = {
        user_id: user.id,
        mood,
        journal_text: journalText,
        sentiment: sentimentResult ? sentimentResult.label : null,
        sentiment_score: sentimentResult ? sentimentResult.score : null,
        emotion: emotionResult ? emotionResult.label : null,
        emotion_score: emotionResult ? emotionResult.score : null,
        wellness_tip: wellnessTip ? wellnessTip.tip : null,
        created_at: new Date().toISOString(),
      };
      
      const { data, error } = await createMoodEntry(moodEntry);
      
      if (error) throw error;
      

      setMoodEntries(prev => [data[0], ...prev]);
      
      return { 
        data: data[0], 
        aiResults: {
          sentiment: sentimentResult,
          emotion: emotionResult,
          wellnessTip: wellnessTip
        },
        error: null 
      };
    } catch (err) {
      console.error('Error adding mood entry:', err);
      setError(err.message);
      return { data: null, error: err.message };
    } finally {
      setLoading(false);
    }
  };


  const getMoodStats = () => {
    if (!moodEntries.length) return {};
    

    const moodCounts = moodEntries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {});
    

    const totalEntries = moodEntries.length;
    const moodPercentages = {};
    
    for (const mood in moodCounts) {
      moodPercentages[mood] = (moodCounts[mood] / totalEntries) * 100;
    }
    

    let mostFrequentMood = null;
    let maxCount = 0;
    
    for (const mood in moodCounts) {
      if (moodCounts[mood] > maxCount) {
        maxCount = moodCounts[mood];
        mostFrequentMood = mood;
      }
    }
    
    return {
      counts: moodCounts,
      percentages: moodPercentages,
      mostFrequent: mostFrequentMood,
      total: totalEntries,
    };
  };


  useEffect(() => {
    if (user) {
      fetchMoodEntries();
    } else {
      setMoodEntries([]);
    }
  }, [user]);

  const value = {
    moodEntries,
    moodTypes,
    loading,
    error,
    fetchMoodEntries,
    addMoodEntry,
    getMoodStats,
  };

  return (
    <MoodContext.Provider value={value}>
      {children}
    </MoodContext.Provider>
  );
};
