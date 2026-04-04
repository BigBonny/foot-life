const fs = require('fs');
const path = require('path');

// Simple UUID generator
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// French translations for team names
const translations = {
  'algeria': 'Algérie',
  'argentina': 'Argentine',
  'atletico-madrid': 'Atlético Madrid',
  'barca': 'Barcelona',
  'barcelone': 'Barcelone',
  'brazil': 'Brésil',
  'chelsea': 'Chelsea',
  'coppenhangen': 'Copenhague',
  'english-team': 'Équipe d\'Angleterre',
  'french-team': 'Équipe de France',
  'hilal': 'Al Hilal',
  'lyon': 'Lyon',
  'man-city': 'Manchester City',
  'marseille': 'Marseille',
  'miami': 'Miami',
  'morocco': 'Maroc',
  'nassr': 'Al Nassr',
  'nb-11': 'NB-11',
  'paris-fc': 'Paris FC',
  'portugal': 'Portugal',
  'psg': 'PSG',
  'real-madrid': 'Real Madrid',
  'roma': 'Rome'
};

// Color translations
const colorTranslations = {
  'pink': 'Rose',
  'blue': 'Bleu',
  'black': 'Noir',
  'red': 'Rouge',
  'green': 'Vert',
  'white': 'Blanc',
  'yellow': 'Jaune',
  'cyan': 'Cyan',
  'lime': 'Vert Lime',
  'orange': 'Orange',
  'multicolors': 'Multicolore',
  'grey': 'Gris',
  'light-blue': 'Bleu Clair',
  'rain': 'Arc-en-ciel',
  'perrot': 'Perrot'
};

// Common description for all jerseys
const commonDescription = `Coupe : standard / unisexe (prend ta taille habituelle)
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
Laver à l'envers à 30°C
Éviter le sèche-linge (pour préserver le flocage)
Ne pas repasser directement sur l'impression / le flocage
Séchage à l'air libre recommandé
Laver avec des couleurs similaires`;

function processJerseys() {
  const jerseysDir = path.join(__dirname, '..', 'jerseys');
  const files = fs.readdirSync(jerseysDir);
  
  // Group files by base name (without -front/-back)
  const jerseyGroups = {};
  
  files.forEach(file => {
    if (file.endsWith('.jpeg')) {
      const baseName = file.replace(/-front\.jpeg$|-back\.jpeg$/, '');
      const type = file.includes('-front') ? 'front' : 'back';
      
      if (!jerseyGroups[baseName]) {
        jerseyGroups[baseName] = {};
      }
      jerseyGroups[baseName][type] = file;
    }
  });
  
  // Filter only jerseys with both front and back
  const completeJerseys = Object.entries(jerseyGroups)
    .filter(([name, files]) => files.front && files.back)
    .map(([baseName, files]) => {
      // Parse the base name to extract team and color
      const parts = baseName.split('-');
      const team = parts.slice(0, -1).join('-');
      const color = parts[parts.length - 1];
      
      const translatedTeam = translations[team] || team;
      const translatedColor = colorTranslations[color] || color;
      
      // Generate French title
      let title = `Maillot ${translatedTeam}`;
      if (translatedColor !== translatedTeam) {
        title += ` ${translatedColor}`;
      }
      
      return {
        id: 'gen_random_uuid()', // Use PostgreSQL UUID generation
        name: title,
        description: commonDescription,
        price: 30.00,
        images: {
          front: `/jerseys/${files.front}`,
          back: `/jerseys/${files.back}`
        },
        category: 'national',
        team: team,
        is_personalized: true,
        is_best_seller: Math.random() > 0.7,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [translatedColor],
        stock: {
          'S': Math.floor(Math.random() * 50) + 10,
          'M': Math.floor(Math.random() * 50) + 10,
          'L': Math.floor(Math.random() * 50) + 10,
          'XL': Math.floor(Math.random() * 50) + 10
        }
      };
    });
  
  return completeJerseys;
}

function generateSQL(jerseys) {
  const sqlStatements = jerseys.map(jersey => `
INSERT INTO products (
    id,
    name,
    description,
    price,
    image,
    images,
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
    ${jersey.id === 'gen_random_uuid()' ? jersey.id : `'${jersey.id}'`},
    '${jersey.name.replace(/'/g, "''")}',
    '${jersey.description.replace(/'/g, "''")}',
    ${jersey.price},
    '${jersey.images.front}',
    '${JSON.stringify(jersey.images).replace(/'/g, "''")}',
    '${jersey.category}',
    '${jersey.team}',
    ${jersey.is_personalized},
    ${jersey.is_best_seller},
    ARRAY['${jersey.sizes.join("','")}'],
    ARRAY['${jersey.colors.join("','")}'],
    '${JSON.stringify(jersey.stock).replace(/'/g, "''")}',
    ${Object.values(jersey.stock).reduce((sum, val) => sum + val, 0)},
    NOW(),
    NOW()
);`).join('\n');

  return `-- Jersey Import Script
-- Generated ${jerseys.length} jerseys with front/back images

${sqlStatements}

-- Summary
SELECT COUNT(*) as total_jerseys_imported FROM products WHERE images IS NOT NULL;`;
}

function generateJSON(jerseys) {
  return JSON.stringify(jerseys, null, 2);
}

// Process the jerseys
const jerseys = processJerseys();

// Create output files
const jerseysDir = path.join(__dirname, '..', 'jerseys');
fs.writeFileSync(path.join(jerseysDir, 'processed-jerseys.json'), generateJSON(jerseys));
fs.writeFileSync(path.join(jerseysDir, 'jerseys-import.sql'), generateSQL(jerseys));

console.log(`✅ Processed ${jerseys.length} complete jerseys (front + back)`);
console.log(`📁 Files created in jerseys folder:`);
console.log(`   - processed-jerseys.json (data file)`);
console.log(`   - jerseys-import.sql (SQL import script)`);
console.log(`\n🎯 Sample jerseys:`);
jerseys.slice(0, 5).forEach(jersey => {
  console.log(`   - ${jersey.name}`);
});

console.log(`\n📋 To import:`);
console.log(`1. Copy jerseys-import.sql to Supabase SQL Editor`);
console.log(`2. Run the script`);
console.log(`3. Move jersey images to your public folder`);
