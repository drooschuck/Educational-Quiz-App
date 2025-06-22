const fs = require('fs');
const path = require('path');

function convertFileFormat(inputPath, outputPath) {
  // Read the input file
  const data = fs.readFileSync(inputPath, 'utf8');

  // Extract quizSubject and questions
  const quizSubjectMatch = data.match(/export let quizSubject = "(.*?)";/);
  const questionsMatch = data.match(/let questions = (\[.*?\]);/s);

  if (!quizSubjectMatch || !questionsMatch) {
    console.error(`Invalid file format in ${inputPath}`);
    return false;
  }

  const quizSubject = quizSubjectMatch[1];
  const questions = questionsMatch[1];

  // Create the new format
  const newFormat = `export { questions };

export default {
  "quizSubject": "${quizSubject}",
  "questions": ${questions.replace(/numb: \d+,/g, '')}
};`;

  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write the new format to output path
  fs.writeFileSync(outputPath, newFormat, 'utf8');
  return true;
}

function processDirectory(inputRoot, outputRoot) {
  // Read all files and directories
  const items = fs.readdirSync(inputRoot);

  items.forEach(item => {
    const fullInputPath = path.join(inputRoot, item);
    const stat = fs.statSync(fullInputPath);

    if (stat.isDirectory()) {
      // Recursively process subdirectories
      processDirectory(fullInputPath, path.join(outputRoot, item));
    } else if (
      path.extname(item) === '.js' && 
      item.startsWith('Y9') // <-- Only process files starting with Y9
    ) {
      // Process JavaScript files that start with Y9
      const outputPath = path.join(outputRoot, path.relative(inputRoot, fullInputPath));
      if (convertFileFormat(fullInputPath, outputPath)) {
        console.log(`Converted: ${fullInputPath} -> ${outputPath}`);
      }
    }
  });
}

// Example usage
const inputRoot = './data';    // Source directory
const outputRoot = './converted_data';  // Output directory

if (!fs.existsSync(inputRoot)) {
  console.error(`Input directory does not exist: ${inputRoot}`);
  process.exit(1);
}

// Start processing
console.log(`Converting Y9*.js files from ${inputRoot} to ${outputRoot}`);
processDirectory(inputRoot, outputRoot);
console.log('Conversion complete!');
