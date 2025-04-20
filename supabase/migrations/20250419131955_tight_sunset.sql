/*
  # Add INSERT policy for profiles table

  1. Security Changes
    - Add policy allowing authenticated users to insert their own profile
    - This resolves the 403 Forbidden error when users try to create their profile

  The existing policies only allow SELECT and UPDATE operations, but not INSERT, 
  which is causing the "new row violates row-level security policy" error.
*/

-- Add policy to allow users to insert their own profile
CREATE POLICY "Users can insert their own profile" 
ON public.profiles
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = id);