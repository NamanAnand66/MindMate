/*
  # Create missing profiles for existing users

  This migration ensures that all existing authenticated users have 
  corresponding entries in the profiles table.
*/

-- Insert profiles for any auth.users who don't have one
DO $$
BEGIN
  INSERT INTO profiles (id, email)
  SELECT id, email
  FROM auth.users
  WHERE id NOT IN (SELECT id FROM profiles);
END $$;