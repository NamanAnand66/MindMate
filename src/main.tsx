import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';
import { SupabaseProvider } from './contexts/SupabaseContext';
import { MoodProvider } from './contexts/MoodContext';
import { TaskProvider } from './contexts/TaskContext';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <SupabaseProvider>
        <ThemeProvider>
          <MoodProvider>
            <TaskProvider>
              <App />
            </TaskProvider>
          </MoodProvider>
        </ThemeProvider>
      </SupabaseProvider>
    </BrowserRouter>
  </StrictMode>
);