-- Test carousel functionality
-- Check if jerseys have images column populated

SELECT 
    id,
    name,
    team,
    images IS NOT NULL as has_images,
    images,
    image
FROM products 
WHERE images IS NOT NULL 
LIMIT 3;

-- This should show jerseys with front/back images in JSON format
