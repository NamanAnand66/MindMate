import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, upsertUserProfile } from '../services/supabaseClient';

const SupabaseContext = createContext();

export const useSupabase = () => useContext(SupabaseContext);

export const SupabaseProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize session and user on mount
  useEffect(() => {
    const initSession = async () => {
      try {
        setLoading(true);
        
        // Get current session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        
        if (currentSession?.user) {
          setUser(currentSession.user);
          
          // Ensure the user has a profile
          await ensureUserProfile(currentSession.user);
        }
        
        // Set up auth state listener
        const { data: { subscription } } = await supabase.auth.onAuthStateChange(
          async (_event, newSession) => {
            setSession(newSession);
            
            if (newSession?.user) {
              setUser(newSession.user);
              
              // Ensure the user has a profile
              await ensureUserProfile(newSession.user);
            } else {
              setUser(null);
            }
          }
        );
        
        setError(null);
        return () => subscription.unsubscribe();
      } catch (err) {
        console.error('Error initializing session:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initSession();
  }, []);
  
  // Ensure user has a profile
  const ensureUserProfile = async (user) => {
    if (!user) return;
    
    try {
      // Create or update user profile
      await upsertUserProfile({
        id: user.id,
        email: user.email,
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.error('Error ensuring user profile:', err);
    }
  };

  // Sign up new user
  const signUp = async (email, password) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Ensure a profile is created for the new user
      if (data?.user) {
        await ensureUserProfile(data.user);
      }
      
      return { data, error: null };
    } catch (err) {
      console.error('Error signing up:', err);
      setError(err.message);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Sign in existing user
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Ensure a profile exists for the signed-in user
      if (data?.user) {
        await ensureUserProfile(data.user);
      }
      
      return { data, error: null };
    } catch (err) {
      console.error('Error signing in:', err);
      setError(err.message);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      return { error: null };
    } catch (err) {
      console.error('Error signing out:', err);
      setError(err.message);
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    session,
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    supabase,
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
};