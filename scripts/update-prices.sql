-- Update all product prices from 30.00 to 29.99
UPDATE products 
SET price = 29.99, updated_at = NOW()
WHERE price = 30.00;

-- Verify the updates
SELECT 
  name, 
  price, 
  team,
  updated_at
FROM products 
WHERE price = 29.99 
ORDER BY updated_at DESC 
LIMIT 5;
