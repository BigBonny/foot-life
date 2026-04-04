-- Check personalized_jerseys table structure
-- Run this to see what columns exist and their types

SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'personalized_jerseys'
ORDER BY ordinal_position;
