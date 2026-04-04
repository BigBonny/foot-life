-- Check newsletter_subscriptions table and policies
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'newsletter_subscriptions'
ORDER BY ordinal_position;

-- Check existing policies
SELECT * FROM pg_policies 
WHERE tablename = 'newsletter_subscriptions';
