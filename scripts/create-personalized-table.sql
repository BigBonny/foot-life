-- Create or update personalized_jerseys table
-- Run this to ensure the table exists with correct structure

-- Drop table if it exists (for clean recreation)
DROP TABLE IF EXISTS personalized_jerseys;

-- Create the table with correct structure
CREATE TABLE personalized_jerseys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    product_id UUID NOT NULL,
    product_name TEXT NOT NULL,
    product_image TEXT NOT NULL,
    product_price DECIMAL(10,2) NOT NULL,
    custom_name TEXT NOT NULL,
    custom_number INTEGER NOT NULL,
    custom_size TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE personalized_jerseys ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own personalized jerseys
CREATE POLICY "Users can view own personalized jerseys" ON personalized_jerseys
    FOR SELECT USING (auth.uid()::text = user_id);

-- Policy: Users can insert their own personalized jerseys
CREATE POLICY "Users can insert own personalized jerseys" ON personalized_jerseys
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Policy: Users can update their own personalized jerseys
CREATE POLICY "Users can update own personalized jerseys" ON personalized_jerseys
    FOR UPDATE USING (auth.uid()::text = user_id);

-- Policy: Users can delete their own personalized jerseys
CREATE POLICY "Users can delete own personalized jerseys" ON personalized_jerseys
    FOR DELETE USING (auth.uid()::text = user_id);

-- Create indexes for better performance
CREATE INDEX idx_personalized_jerseys_user_id ON personalized_jerseys(user_id);
CREATE INDEX idx_personalized_jerseys_product_id ON personalized_jerseys(product_id);

-- Check the table structure
\d personalized_jerseys;
