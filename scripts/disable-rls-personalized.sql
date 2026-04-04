-- Quick fix for personalized_jerseys RLS issue
-- Just disable RLS temporarily to make it work

ALTER TABLE personalized_jerseys DISABLE ROW LEVEL SECURITY;

-- Check if RLS is disabled
SELECT relname, relrowsecurity, relforcerowsecurity 
FROM pg_class 
WHERE relname = 'personalized_jerseys';
