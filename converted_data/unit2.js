const fs = require('fs');
const path = require('path');

function renameFiles(directory, counter = { value: 1 }) {
  const items = fs.readdirSync(directory);

  items.forEach(item => {
    const fullPath = path.join(directory, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Process subdirectories recursively
      renameFiles(fullPath, counter);
    } else if (path.extname(item) === '.js') {
      // Only rename JavaScript files
      const newName = `unit${counter.value}.js`;
      const newPath = path.join(directory, newName);
      
      try {
        fs.renameSync(fullPath, newPath);
        console.log(`Renamed: ${fullPath} -> ${newPath}`);
        counter.value++;
      } catch (err) {
        console.error(`Error renaming ${fullPath}:`, err);
      }
    }
  });
}

// Start renaming from current directory
console.log('Starting file renaming...');
renameFiles(process.cwd());
console.log('File renaming complete!');
