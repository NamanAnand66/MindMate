import { HfInference } from '@huggingface/inference';

// Initialize Hugging Face Inference with API key fallback
const apiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY;
const hf = apiKey ? new HfInference(apiKey) : null;

// Check if Hugging Face API is available
const isHfAvailable = () => {
  // Check if API key exists and is not the placeholder value
  return !!apiKey && 
         apiKey !== 'your_huggingface_api_key_here' && 
         !!hf;
};

// Sentiment analysis model
const SENTIMENT_MODEL = 'distilbert-base-uncased-finetuned-sst-2-english';
const TEXT_GENERATION_MODEL = 'gpt2';
const TEXT_CLASSIFICATION_MODEL = 'bhadresh-savani/distilbert-base-uncased-emotion';

// Analyze the sentiment of a text
export const analyzeSentiment = async (text) => {
  try {
    if (!text.trim()) {
      throw new Error('Text cannot be empty');
    }
    
    if (!isHfAvailable()) {
      return mockAnalyzeSentiment(text);
    }
    
    // Truncate long texts to prevent issues with API
    const truncatedText = text.length > 500 ? `${text.substring(0, 500)}...` : text;
    
    const result = await hf.textClassification({
      model: SENTIMENT_MODEL,
      inputs: truncatedText,
    });
    
    return { data: result, error: null };
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    return mockAnalyzeSentiment(text);
  }
};

// Analyze emotions in text
export const analyzeEmotion = async (text) => {
  try {
    if (!text.trim()) {
      throw new Error('Text cannot be empty');
    }
    
    if (!isHfAvailable()) {
      return mockAnalyzeEmotion(text);
    }
    
    // Truncate long texts to prevent issues with API
    const truncatedText = text.length > 500 ? `${text.substring(0, 500)}...` : text;
    
    const result = await hf.textClassification({
      model: TEXT_CLASSIFICATION_MODEL,
      inputs: truncatedText,
    });
    
    return { data: result, error: null };
  } catch (error) {
    console.error('Error analyzing emotion:', error);
    return mockAnalyzeEmotion(text);
  }
};

// Generate a motivational message based on the user's mood
export const generateUpliftingMessage = async (moodContext) => {
  try {
    // If API key is missing, use mock function
    if (!isHfAvailable()) {
      return mockGenerateUpliftingMessage(moodContext);
    }
    
    // Create a prompt based on the user's recent mood
    const prompt = `Generate a short, positive, and uplifting message for someone who is feeling ${moodContext}. The message should be encouraging and motivational.`;
    
    const result = await hf.textGeneration({
      model: TEXT_GENERATION_MODEL,
      inputs: prompt,
      parameters: {
        max_new_tokens: 100,
        temperature: 0.7,
        top_p: 0.9,
        do_sample: true,
      },
    });
    
    // Clean up the generated text
    const message = result.generated_text
      .replace(prompt, '')
      .trim()
      .split('\n')
      .filter(line => line.trim().length > 0)
      .join(' ');
    
    return { data: message, error: null };
  } catch (error) {
    console.error('Error generating uplifting message:', error);
    return mockGenerateUpliftingMessage(moodContext);
  }
};

// Generate wellness tips based on mood analysis
export const generateWellnessTip = async (journalText) => {
  try {
    if (!journalText.trim()) {
      throw new Error('Journal text cannot be empty');
    }
    
    // If API key is missing, use mock function
    if (!isHfAvailable()) {
      // Get a mock emotion analysis
      const { data: emotionData } = mockAnalyzeEmotion(journalText);
      const dominantEmotion = emotionData?.label || 'neutral';
      
      return { 
        data: {
          emotion: dominantEmotion,
          tip: mockGenerateUpliftingMessage(dominantEmotion).data
        }, 
        error: null 
      };
    }
    
    // Analyze emotion first
    const { data: emotionData, error: emotionError } = await analyzeEmotion(journalText);
    
    if (emotionError) {
      throw new Error(emotionError);
    }
    
    // Get the dominant emotion
    const dominantEmotion = emotionData?.label || 'neutral';
    
    // Create a prompt for generating a wellness tip
    const prompt = `Based on a journal entry expressing ${dominantEmotion}, suggest a brief, practical wellness tip to help improve their wellbeing.`;
    
    const result = await hf.textGeneration({
      model: TEXT_GENERATION_MODEL,
      inputs: prompt,
      parameters: {
        max_new_tokens: 150,
        temperature: 0.7,
        top_p: 0.9,
        do_sample: true,
      },
    });
    
    // Clean up the generated text
    const tip = result.generated_text
      .replace(prompt, '')
      .trim()
      .split('\n')
      .filter(line => line.trim().length > 0)
      .join(' ');
    
    return { 
      data: {
        emotion: dominantEmotion,
        tip: tip
      }, 
      error: null 
    };
  } catch (error) {
    console.error('Error generating wellness tip:', error);
    // Fallback to mock data
    const { data: emotionData } = mockAnalyzeEmotion(journalText);
    const dominantEmotion = emotionData?.label || 'neutral';
    
    return { 
      data: {
        emotion: dominantEmotion,
        tip: mockGenerateUpliftingMessage(dominantEmotion).data
      }, 
      error: null 
    };
  }
};

// Fallback functions when API is not available
export const mockAnalyzeSentiment = (text) => {
  const sentiments = ['POSITIVE', 'NEGATIVE', 'NEUTRAL'];
  const randomIndex = Math.floor(Math.random() * sentiments.length);
  
  return {
    data: {
      label: sentiments[randomIndex],
      score: Math.random()
    },
    error: null
  };
};

export const mockAnalyzeEmotion = (text) => {
  const emotions = ['joy', 'sadness', 'anger', 'fear', 'love', 'surprise'];
  const randomIndex = Math.floor(Math.random() * emotions.length);
  
  return {
    data: {
      label: emotions[randomIndex],
      score: Math.random()
    },
    error: null
  };
};

export const mockGenerateUpliftingMessage = (moodContext) => {
  const messages = [
    "Every day is a new beginning. Take a deep breath and start again.",
    "You are stronger than you think. Keep going!",
    "Small steps still move you forward. Be proud of your progress.",
    "Your potential is endless. Believe in yourself.",
    "Today may be tough, but tomorrow holds new possibilities."
  ];
  
  const randomIndex = Math.floor(Math.random() * messages.length);
  
  return {
    data: messages[randomIndex],
    error: null
  };
};