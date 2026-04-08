-- Insert France Green Jersey
INSERT INTO products (
  id,
  name,
  description,
  price,
  image,
  images,
  category,
  team,
  season,
  type,
  stock,
  sizes,
  colors,
  is_best_seller,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'Maillot France Vert Domicile',
  'Maillot de l''équipe nationale de France dans sa couleur verte emblématique. Fabriqué avec des matériaux de haute qualité pour un confort optimal durant les matchs.',
  89.99,
  '/jerseys/france-green-front.jpeg',
  '{"front": "/jerseys/france-green-front.jpeg", "back": "/jerseys/france-green-back.jpeg"}',
  'national',
  'France',
  '2024-25',
  'home',
  50,
  ARRAY['S', 'M', 'L', 'XL', 'XXL'],
  ARRAY['Vert', 'Blanc'],
  false,
  NOW(),
  NOW()
);

-- Insert Brazil Rose Jersey
INSERT INTO products (
  id,
  name,
  description,
  price,
  image,
  images,
  category,
  team,
  season,
  type,
  stock,
  sizes,
  colors,
  is_best_seller,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'Maillot Brésil Rose Domicile',
  'Maillot de l''équipe nationale du Brésil dans sa couleur rose moderne. Fabriqué avec des matériaux de haute qualité pour un confort optimal durant les matchs.',
  89.99,
  '/jerseys/brazil-rose-front.jpeg',
  '{"front": "/jerseys/brazil-rose-front.jpeg", "back": "/jerseys/brazil-rose-back.jpeg"}',
  'national',
  'Brésil',
  '2024-25',
  'home',
  50,
  ARRAY['S', 'M', 'L', 'XL', 'XXL'],
  ARRAY['Rose', 'Bleu'],
  false,
  NOW(),
  NOW()
);

-- Verify the inserts
SELECT id, name, team, category, price, image, created_at 
FROM products 
WHERE name LIKE '%France Vert%' OR name LIKE '%Brésil Rose%'
ORDER BY created_at DESC;
