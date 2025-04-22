import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, upsertUserProfile } from '../services/supabaseClient';

const SupabaseContext = createContext();

export const useSupabase = () => useContext(SupabaseContext);

export const SupabaseProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const initSession = async () => {
      try {
        setLoading(true);
        

        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        
        if (currentSession?.user) {
          setUser(currentSession.user);
          

          await ensureUserProfile(currentSession.user);
        }
        

        const { data: { subscription } } = await supabase.auth.onAuthStateChange(
          async (_event, newSession) => {
            setSession(newSession);
            
            if (newSession?.user) {
              setUser(newSession.user);
              

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
  

  const ensureUserProfile = async (user) => {
    if (!user) return;
    
    try {

      await upsertUserProfile({
        id: user.id,
        email: user.email,
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.error('Error ensuring user profile:', err);
    }
  };


  const signUp = async (email, password) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      

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


  const signIn = async (email, password) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      

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
