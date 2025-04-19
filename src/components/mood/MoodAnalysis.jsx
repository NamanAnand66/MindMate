import React from 'react';

const MoodAnalysis = ({ analysis }) => {
  if (!analysis) return null;
  
  const { sentiment, emotion, wellnessTip } = analysis;
  
  // Get emoji for emotion
  const getEmotionEmoji = (emotion) => {
    if (!emotion?.label) return '😐';
    
    const emotionEmojis = {
      'joy': '😄',
      'sadness': '😢',
      'anger': '😠',
      'fear': '😨',
      'love': '❤️',
      'surprise': '😲',
      'neutral': '😐'
    };
    
    return emotionEmojis[emotion.label] || '😐';
  };
  
  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-5 border border-gray-200 dark:border-gray-700 animate-slide-up">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
        AI Analysis
      </h3>
      
      <div className="space-y-4">
        {/* Emotion card */}
        {emotion && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <span className="text-2xl" role="img" aria-label={emotion.label}>
                {getEmotionEmoji(emotion)}
              </span>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  {emotion.label.charAt(0).toUpperCase() + emotion.label.slice(1)}
                </h4>
                <div className="mt-1 h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-500 rounded-full" 
                    style={{ width: `${Math.round(emotion.score * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Sentiment card */}
        {sentiment && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
              Overall Sentiment
            </h4>
            <div className={`text-sm px-3 py-1 rounded-full inline-block ${
              sentiment.label === 'POSITIVE' 
                ? 'bg-success-50 text-success-700 dark:bg-success-900/30 dark:text-success-300' 
                : sentiment.label === 'NEGATIVE'
                  ? 'bg-error-50 text-error-700 dark:bg-error-900/30 dark:text-error-300'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}>
              {sentiment.label === 'POSITIVE' ? 'Positive' : 
               sentiment.label === 'NEGATIVE' ? 'Negative' : 'Neutral'}
              {sentiment.score && ` (${Math.round(sentiment.score * 100)}%)`}
            </div>
          </div>
        )}
        
        {/* Wellness tip */}
        {wellnessTip && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
              Personalized Wellness Tip
            </h4>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              {wellnessTip.tip}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodAnalysis;