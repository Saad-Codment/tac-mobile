const fs = require('fs');
const path = require('path');

// Read the actual codegen script
const scriptPath = './node_modules/react-native/scripts/generate-codegen-artifacts.js';
const content = fs.readFileSync(scriptPath, 'utf8');
const lines = content.split('\n');

// Find every line that mentions config.js or libraries or path
console.log('=== Lines mentioning react-native.config or libraries ===');
lines.forEach((line, i) => {
  if (
    line.includes('react-native.config') ||
    line.includes('libraries') ||
    line.includes('rnconfig') ||
    line.includes('getDependencies') ||
    line.includes('getLibraries')
  ) {
    console.log(`${i + 1}: ${line}`);
  }
});

// Also find what script is actually called for react-native.config.js
console.log('\n=== Looking for the function that reads react-native.config.js ===');
const codegenDir = './node_modules/@react-native/codegen';
if (fs.existsSync(codegenDir)) {
  const findFiles = (dir, results = []) => {
    fs.readdirSync(dir).forEach(f => {
      const full = path.join(dir, f);
      if (fs.statSync(full).isDirectory() && !full.includes('node_modules')) {
        findFiles(full, results);
      } else if (f.endsWith('.js')) {
        results.push(full);
      }
    });
    return results;
  };
  const files = findFiles(codegenDir);
  files.forEach(f => {
    const c = fs.readFileSync(f, 'utf8');
    if (c.includes('react-native.config')) {
      console.log('Found in:', f);
      const ls = c.split('\n');
      ls.forEach((l, i) => {
        if (l.includes('react-native.config') || l.includes('path.join') || l.includes('path.resolve')) {
          console.log(`  ${i + 1}: ${l}`);
        }
      });
    }
  });
}

// Check the RN community CLI codegen utils
const cliPath = './node_modules/@react-native-community/cli-config/build/index.js';
if (fs.existsSync(cliPath)) {
  console.log('\n=== CLI config index ===');
  const c = fs.readFileSync(cliPath, 'utf8');
  const ls = c.split('\n');
  ls.forEach((l, i) => {
    if (l.includes('react-native.config') || l.includes('undefined')) {
      console.log(`  ${i + 1}: ${l.substring(0, 120)}`);
    }
  });
}

// Find the actual script that searches react-native.config.js for codegen
const searchPath = './node_modules/react-native/scripts';
if (fs.existsSync(searchPath)) {
  fs.readdirSync(searchPath).forEach(f => {
    if (f.includes('codegen') || f.includes('generate')) {
      console.log('\nFound script:', f);
      const c = fs.readFileSync(path.join(searchPath, f), 'utf8');
      if (c.includes('react-native.config')) {
        const ls = c.split('\n');
        ls.forEach((l, i) => {
          if (l.includes('react-native.config') || (l.includes('path') && l.includes('undefined'))) {
            console.log(`  ${i + 1}: ${l}`);
          }
        });
      }
    }
  });
}
