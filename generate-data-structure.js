const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  years: [7, 8, 9, 10, 11],          // Year groups
  subjects: ['math', 'english', 'history', 'physics', 'chemistry', 'biology'],
  units: [1, 2, 3, 4],         // Units per subject
  dataPath: './data'            // Base path for data
};

// Sample question data template
const questionTemplate = (subject, unit) => ({
  quizSubject: `${subject.charAt(0).toUpperCase() + subject.slice(1)} Unit ${unit}`,
  questions: [
    {
      question: `What is the capital of France? (${subject} unit ${unit})`,
      options: ["London", "Paris", "Berlin", "Madrid"],
      answer: "Paris"
    },
    {
      question: `2 + 2 equals? (${subject} unit ${unit})`,
      options: ["3", "4", "5", "6"],
      answer: "4"
    }
  ]
});

// Create directory if it doesn't exist
function createDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

// Generate all data structure
function generateDataStructure() {
  try {
    // Create base data directory
    createDir(config.dataPath);

    config.years.forEach(year => {
      const yearPath = path.join(config.dataPath, `year${year}`);
      createDir(yearPath);

      config.subjects.forEach(subject => {
        const subjectPath = path.join(yearPath, subject);
        createDir(subjectPath);

        config.units.forEach(unit => {
          const filePath = path.join(subjectPath, `unit${unit}.js`);
          const content = `module.exports = ${JSON.stringify(questionTemplate(subject, unit), null, 2)};\n`;
          
          fs.writeFileSync(filePath, content);
          console.log(`Created file: ${filePath}`);
        });
      });
    });

    console.log('\n✅ Data structure generation complete!');
  } catch (error) {
    console.error('\n❌ Error generating data structure:', error);
  }
}

// Run the generator
generateDataStructure();
