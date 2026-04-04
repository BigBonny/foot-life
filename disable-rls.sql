-- Disable RLS temporarily for testing
ALTER TABLE personalized_jerseys DISABLE ROW LEVEL SECURITY;

-- Or create a very permissive policy
DROP POLICY IF EXISTS "Allow all for authenticated users" ON personalized_jerseys;

CREATE POLICY "Allow all" ON personalized_jerseys
  FOR ALL 
  USING (true)
  WITH CHECK (true);
