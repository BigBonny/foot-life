-- Add new jersey products to database (with explicit image column)
-- Tunisia Yellow Jersey
INSERT INTO products (id, name, description, price, category, team, image, images, stock, sizes, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Maillot Tunisie Jaune',
  'Maillot officiel de l''équipe nationale de Tunisie dans sa couleur jaune emblématique. Fabriqué avec des matériaux de haute qualité pour un confort optimal durant les matchs.',
  29.99,
  'national',
  'Tunisia',
  '/jerseys/tunisia-yellow-front.jpeg',
  '{"front": "/jerseys/tunisia-yellow-front.jpeg", "back": "/jerseys/tunisia-yellow-back.jpeg"}',
  50,
  ARRAY['S', 'M', 'L', 'XXL']::text[],
  NOW(),
  NOW()
);

-- Spain Team White Jersey
INSERT INTO products (id, name, description, price, category, team, image, images, stock, sizes, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Maillot Espagne Blanc',
  'Maillot officiel de l''équipe nationale d''Espagne en version blanche. Confectionné avec les technologies les plus récentes pour des performances maximales.',
  29.99,
  'national',
  'Spain',
  '/jerseys/spain-team-white-front.jpeg',
  '{"front": "/jerseys/spain-team-white-front.jpeg", "back": "/jerseys/spain-team-white-back.jpeg"}',
  50,
  ARRAY['S', 'M', 'L', 'XXL']::text[],
  NOW(),
  NOW()
);

-- Argentina Blue Flowers Jersey
INSERT INTO products (id, name, description, price, category, team, image, images, stock, sizes, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Maillot Argentine Fleurs Bleues',
  'Maillot unique de l''Argentine avec motif floral bleu. Design exclusif alliant tradition et modernité, parfait pour les supporters passionnés.',
  29.99,
  'national',
  'Argentina',
  '/jerseys/argentina-blue-flowers-front.jpeg',
  '{"front": "/jerseys/argentina-blue-flowers-front.jpeg", "back": "/jerseys/argentina-blue-flowers-back.jpeg"}',
  50,
  ARRAY['S', 'M', 'L', 'XXL']::text[],
  NOW(),
  NOW()
);

-- Update all product prices to 29.99
UPDATE products 
SET price = 29.99, updated_at = NOW()
WHERE price = 30.00;
