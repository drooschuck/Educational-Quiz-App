const fs = require('fs');
const path = require('path');

function renameFiles(directory) {
  const items = fs.readdirSync(directory);
  let counter = 1; // Reset counter for each new folder

  items.forEach(item => {
    const fullPath = path.join(directory, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Process subdirectories with fresh counter
      renameFiles(fullPath);
    } else if (path.extname(item) === '.js') {
      const newName = `unit${counter}.js`;
      const newPath = path.join(directory, newName);
      
      try {
        // Skip if already correctly named
        if (item !== newName) {
          fs.renameSync(fullPath, newPath);
          console.log(`Renamed: ${path.relative(process.cwd(), fullPath)} -> ${newName}`);
        }
        counter++;
      } catch (err) {
        console.error(`Error renaming ${fullPath}:`, err);
      }
    }
  });
}

// Start renaming from current directory
console.log('Starting file renaming (per-folder numbering)...');
renameFiles(process.cwd());
console.log('File renaming complete!');
