-- Create personalized jerseys table
CREATE TABLE IF NOT EXISTS personalized_jerseys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_image TEXT NOT NULL,
  product_price DECIMAL(10,2) NOT NULL,
  custom_name TEXT,
  custom_number INTEGER,
  custom_size TEXT NOT NULL,
  custom_color TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE personalized_jerseys ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own personalized jerseys" ON personalized_jerseys
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own personalized jerseys" ON personalized_jerseys
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own personalized jerseys" ON personalized_jerseys
  FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own personalized jerseys" ON personalized_jerseys
  FOR DELETE USING (auth.uid()::text = user_id);

-- Allow public access for now (simpler for testing)
-- TODO: Restrict to authenticated users only
DROP POLICY IF EXISTS "Users can view their own personalized jerseys" ON personalized_jerseys;
DROP POLICY IF EXISTS "Users can insert their own personalized jerseys" ON personalized_jerseys;
DROP POLICY IF EXISTS "Users can update their own personalized jerseys" ON personalized_jerseys;
DROP POLICY IF EXISTS "Users can delete their own personalized jerseys" ON personalized_jerseys;

CREATE POLICY "Enable all operations for authenticated users" ON personalized_jerseys
  FOR ALL USING (auth.role() = 'authenticated');

-- Create index
CREATE INDEX IF NOT EXISTS idx_personalized_jerseys_user_id ON personalized_jerseys(user_id);
