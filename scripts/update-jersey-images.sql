-- Update existing jerseys to include images column
-- Run this if jerseys were imported without images

-- Update all jerseys that have team but no images
UPDATE products 
SET images = jsonb_build_object(
    'front', image,
    'back', REPLACE(image, '-front.jpeg', '-back.jpeg')
)
WHERE team IS NOT NULL 
AND images IS NULL
AND image LIKE '%-front.jpeg';

-- Check the update
SELECT 
    id, 
    name, 
    team,
    image,
    images,
    images IS NOT NULL as has_images
FROM products 
WHERE team IS NOT NULL 
LIMIT 5;
