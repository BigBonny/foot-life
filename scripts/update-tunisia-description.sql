-- Update Tunisia jersey description to remove 'officiel'
UPDATE products 
SET description = 'Maillot de l''équipe nationale de Tunisie dans sa couleur jaune emblématique. Fabriqué avec des matériaux de haute qualité pour un confort optimal durant les matchs.'
WHERE description LIKE '%Maillot officiel de l''équipe nationale de Tunisie%'
   OR name LIKE '%Tunisie%';

-- Verify the update
SELECT id, name, description FROM products WHERE name LIKE '%Tunisie%';
