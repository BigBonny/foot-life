const fs = require('fs');
const path = require('path');

function copyJerseyImages() {
  const sourceDir = path.join(__dirname, '..', 'jerseys');
  const publicDir = path.join(__dirname, '..', 'public', 'jerseys');
  
  // Create public/jerseys directory if it doesn't exist
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  // Get all jersey files
  const files = fs.readdirSync(sourceDir);
  
  // Copy only image files (skip JSON and SQL files)
  let copiedCount = 0;
  files.forEach(file => {
    if (file.endsWith('.jpeg') || file.endsWith('.jpg') || file.endsWith('.png')) {
      const sourcePath = path.join(sourceDir, file);
      const destPath = path.join(publicDir, file);
      
      try {
        fs.copyFileSync(sourcePath, destPath);
        copiedCount++;
        console.log(`✅ Copied: ${file}`);
      } catch (error) {
        console.error(`❌ Error copying ${file}:`, error.message);
      }
    }
  });
  
  console.log(`\n🎯 Successfully copied ${copiedCount} jersey images to public/jerseys/`);
  console.log(`📂 Images are now accessible at /jerseys/filename.jpeg`);
}

copyJerseyImages();
