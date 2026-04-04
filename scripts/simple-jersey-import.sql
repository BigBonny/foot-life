-- Simple Jersey Import - Manual Version
-- Run this if the test import works

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
) VALUES 
-- Atlético Madrid Blue
(
    gen_random_uuid(),
    'Maillot Atlético Madrid Bleu',
    'Coupe : standard / unisexe (prend ta taille habituelle)
Matière : tissu respirant, léger et agréable à porter
Flocage : finition premium, rendu net et durable
Détails : écussons + logos intégrés selon le modèle
Confort : idéal au quotidien comme pour le sport

Matériaux & Entretien
Matériaux
Tissu léger et respirant
Toucher doux, confortable au quotidien
Finition premium (impression / flocage selon le modèle)

Entretien
Laver à l''envers à 30°C
Éviter le sèche-linge (pour préserver le flocage)
Ne pas repasser directement sur l''impression / le flocage
Séchage à l''air libre recommandé
Laver avec des couleurs similaires',
    30.00,
    '/jerseys/atletico-madrid-blue-front.jpeg',
    'national',
    'atletico-madrid',
    true,
    false,
    ARRAY['S','M','L','XL'],
    ARRAY['Bleu'],
    '{"S":16,"M":13,"L":10,"XL":34}',
    73,
    NOW(),
    NOW()
),
-- Barcelona Blue  
(
    gen_random_uuid(),
    'Maillot Barcelona Bleu',
    'Coupe : standard / unisexe (prend ta taille habituelle)
Matière : tissu respirant, léger et agréable à porter
Flocage : finition premium, rendu net et durable
Détails : écussons + logos intégrés selon le modèle
Confort : idéal au quotidien comme pour le sport

Matériaux & Entretien
Matériaux
Tissu léger et respirant
Toucher doux, confortable au quotidien
Finition premium (impression / flocage selon le modèle)

Entretien
Laver à l''envers à 30°C
Éviter le sèche-linge (pour préserver le flocage)
Ne pas repasser directement sur l''impression / le flocage
Séchage à l''air libre recommandé
Laver avec des couleurs similaires',
    30.00,
    '/jerseys/barca-blue-front.jpeg',
    'national',
    'barca',
    true,
    false,
    ARRAY['S','M','L','XL'],
    ARRAY['Bleu'],
    '{"S":25,"M":19,"L":22,"XL":31}',
    97,
    NOW(),
    NOW()
),
-- Brazil Front
(
    gen_random_uuid(),
    'Maillot Brésil Domicile',
    'Coupe : standard / unisexe (prend ta taille habituelle)
Matière : tissu respirant, léger et agréable à porter
Flocage : finition premium, rendu net et durable
Détails : écussons + logos intégrés selon le modèle
Confort : idéal au quotidien comme pour le sport

Matériaux & Entretien
Matériaux
Tissu léger et respirant
Toucher doux, confortable au quotidien
Finition premium (impression / flocage selon le modèle)

Entretien
Laver à l''envers à 30°C
Éviter le sèche-linge (pour préserver le flocage)
Ne pas repasser directement sur l''impression / le flocage
Séchage à l''air libre recommandé
Laver avec des couleurs similaires',
    30.00,
    '/jerseys/brazil-front.jpeg',
    'national',
    'brazil',
    true,
    false,
    ARRAY['S','M','L','XL'],
    ARRAY['Jaune', 'Vert', 'Bleu'],
    '{"S":18,"M":24,"L":20,"XL":28}',
    90,
    NOW(),
    NOW()
);

-- Check results
SELECT COUNT(*) as imported_jerseys FROM products WHERE images IS NOT NULL;
