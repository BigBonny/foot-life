const fs = require('fs');
const path = require('path');

// Sample jersey data generator
const teams = [
  { name: 'France', code: 'france', colors: ['Bleu', 'Blanc', 'Rouge'] },
  { name: 'Brésil', code: 'brazil', colors: ['Jaune', 'Vert', 'Bleu'] },
  { name: 'Allemagne', code: 'germany', colors: ['Noir', 'Blanc', 'Rouge'] },
  { name: 'Argentine', code: 'argentina', colors: ['Bleu Ciel', 'Blanc', 'Noir'] },
  { name: 'Espagne', code: 'spain', colors: ['Rouge', 'Jaune', 'Noir'] },
  { name: 'Italie', code: 'italy', colors: ['Bleu', 'Blanc', 'Noir'] },
  { name: 'Portugal', code: 'portugal', colors: ['Rouge', 'Vert', 'Noir'] },
  { name: 'Angleterre', code: 'england', colors: ['Blanc', 'Rouge', 'Bleu'] },
  { name: 'Pays-Bas', code: 'netherlands', colors: ['Orange', 'Blanc', 'Noir'] },
  { name: 'Belgique', code: 'belgium', colors: ['Rouge', 'Noir', 'Jaune'] }
];

const categories = ['domicile', 'exterieur', 'troisième'];
const years = ['2022', '2023', '2024'];

function generateJerseys() {
  const jerseys = [];
  let id = 1;

  teams.forEach(team => {
    categories.forEach(category => {
      years.forEach(year => {
        const isBestSeller = Math.random() > 0.7;
        const price = 69.99 + Math.random() * 40;
        
        jerseys.push({
          id: `jersey_${String(id).padStart(3, '0')}`,
          name: `Maillot ${category.charAt(0).toUpperCase() + category.slice(1)} ${team.name} ${year}`,
          description: `Maillot officiel ${category} de l'équipe ${team.name} pour la saison ${year}`,
          price: parseFloat(price.toFixed(2)),
          image: `https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&auto=format&sig=${id}`,
          category: 'national',
          team: team.code,
          is_personalized: true,
          is_best_seller: isBestSeller,
          sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
          colors: team.colors,
          stock: {
            'XS': Math.floor(Math.random() * 50) + 10,
            'S': Math.floor(Math.random() * 100) + 20,
            'M': Math.floor(Math.random() * 150) + 30,
            'L': Math.floor(Math.random() * 100) + 20,
            'XL': Math.floor(Math.random() * 75) + 15,
            'XXL': Math.floor(Math.random() * 25) + 5
          }
        });
        
        id++;
      });
    });
  });

  return jerseys;
}

// Generate the jerseys
const jerseys = generateJerseys();

// Create SQL insert statements
const sqlStatements = jerseys.map(jersey => `
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
    stock,
    created_at,
    updated_at
) VALUES (
    '${jersey.id}',
    '${jersey.name.replace(/'/g, "''")}',
    '${jersey.description.replace(/'/g, "''")}',
    ${jersey.price},
    '${jersey.image}',
    '${jersey.category}',
    '${jersey.team}',
    ${jersey.is_personalized},
    ${jersey.is_best_seller},
    '${JSON.stringify(jersey.sizes)}',
    '${JSON.stringify(jersey.colors)}',
    '${JSON.stringify(jersey.stock)}',
    NOW(),
    NOW()
);`).join('\n');

// Create JSON file for easy import
const jsonFile = path.join(__dirname, 'jerseys-data.json');
fs.writeFileSync(jsonFile, JSON.stringify(jerseys, null, 2));

// Create SQL file
const sqlFile = path.join(__dirname, 'jerseys-import.sql');
const fullSql = `-- Bulk Jersey Import
-- Generated ${jerseys.length} jerseys

${sqlStatements}

-- Summary
SELECT COUNT(*) as total_jerseys_imported FROM products WHERE id LIKE 'jersey_%';`;

fs.writeFileSync(sqlFile, fullSql);

console.log(`Generated ${jerseys.length} jerseys`);
console.log(`JSON file saved to: ${jsonFile}`);
console.log(`SQL file saved to: ${sqlFile}`);
console.log('\nTo import:');
console.log('1. Open Supabase SQL Editor');
console.log('2. Copy and paste the contents of jerseys-import.sql');
console.log('3. Run the script');
