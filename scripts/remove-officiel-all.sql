-- Remove 'officiel' from all product descriptions
UPDATE products 
SET description = REPLACE(description, 'officiel ', '')
WHERE description LIKE '%officiel %';

-- Also handle 'officiel' at the end of strings (without trailing space)
UPDATE products 
SET description = REPLACE(description, 'officiel', '')
WHERE description LIKE '%officiel%';

-- Clean up any double spaces that might have been created
UPDATE products 
SET description = REPLACE(description, '  ', ' ')
WHERE description LIKE '%  %';

-- Verify changes
SELECT id, name, description FROM products WHERE description LIKE '%officiel%';
