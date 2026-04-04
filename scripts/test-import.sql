-- Test Import - Just One Jersey
-- Run this to test if the import works

-- First, let's insert just ONE jersey to test
INSERT INTO products (
    id,
    name,
    description,
    price,
    image,
    category,
    team,
    is_personalized,
    is_best_seller,
    sizes,
    colors,
    stock_sizes,
    stock,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'Maillot Test Bleu',
    'Test jersey description',
    30.00,
    '/jerseys/atletico-madrid-blue-front.jpeg',
    'national',
    'atletico-madrid',
    true,
    false,
    ARRAY['S','M','L','XL'],
    ARRAY['Bleu'],
    '{"S":10,"M":15,"L":12,"XL":8}',
    45,
    NOW(),
    NOW()
);

-- Check if it worked
SELECT * FROM products WHERE name = 'Maillot Test Bleu';

-- If this works, the issue was with the UUID format in the original import
