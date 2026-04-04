-- Fix RLS policies for personalized_jerseys table
-- First, drop all existing policies
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON personalized_jerseys;
DROP POLICY IF EXISTS "Users can view their own personalized jerseys" ON personalized_jerseys;
DROP POLICY IF EXISTS "Users can insert their own personalized jerseys" ON personalized_jerseys;
DROP POLICY IF EXISTS "Users can update their own personalized jerseys" ON personalized_jerseys;
DROP POLICY IF EXISTS "Users can delete their own personalized jerseys" ON personalized_jerseys;

-- Create simple policy that allows authenticated users to do everything
CREATE POLICY "Allow all for authenticated users" ON personalized_jerseys
  FOR ALL 
  USING (auth.jwt() ->> 'user_id') 
  WITH CHECK (auth.jwt() ->> 'user_id');
