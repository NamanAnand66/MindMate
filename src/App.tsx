import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useTheme } from './contexts/ThemeContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Journal from './pages/Journal';
import Tasks from './pages/Tasks';
import Insights from './pages/Insights';
import Settings from './pages/Settings';
import AuthPage from './pages/AuthPage';
import { useSupabase } from './contexts/SupabaseContext';
import NotFound from './pages/NotFound';

function App() {
  const { theme } = useTheme();
  const { session } = useSupabase();
  
  
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="min-h-screen transition-colors duration-300">
      <Routes>
        <Route path="/auth" element={session ? <Navigate to="/" /> : <AuthPage />} />
        
       
        <Route element={<Layout />}>
          <Route path="/" element={session ? <Dashboard /> : <Navigate to="/auth" />} />
          <Route path="/journal" element={session ? <Journal /> : <Navigate to="/auth" />} />
          <Route path="/tasks" element={session ? <Tasks /> : <Navigate to="/auth" />} />
          <Route path="/insights" element={session ? <Insights /> : <Navigate to="/auth" />} />
          <Route path="/settings" element={session ? <Settings /> : <Navigate to="/auth" />} />
        </Route>

    
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
