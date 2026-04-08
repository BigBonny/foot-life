-- Test query to check if jerseys exist
SELECT id, name, team, category, price, image 
FROM products 
WHERE name LIKE '%France%' OR name LIKE '%Brésil%'
ORDER BY created_at DESC;

-- Check total count of national jerseys
SELECT COUNT(*) as total_national_jerseys 
FROM products 
WHERE category = 'national';

-- Check if specific jerseys exist
SELECT 'France Green Jersey exists: ' || (SELECT COUNT(*) > 0 FROM products WHERE name LIKE '%France Vert%') as status;
SELECT 'Brazil Rose Jersey exists: ' || (SELECT COUNT(*) > 0 FROM products WHERE name LIKE '%Brésil Rose%') as status;
