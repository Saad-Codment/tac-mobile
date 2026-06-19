const fs = require('fs');
const path = require('path');

// Find ALL copies of the file recursively
const findFiles = (dir, filename, results = []) => {
  try {
    const items = fs.readdirSync(dir);
    items.forEach(item => {
      const full = path.join(dir, item);
      try {
        const stat = fs.statSync(full);
        if (stat.isDirectory() && item !== '.git') {
          findFiles(full, filename, results);
        } else if (item === filename) {
          results.push(full);
        }
      } catch (e) {}
    });
  } catch (e) {}
  return results;
};

const files = findFiles('./node_modules', 'generate-artifacts-executor.js');
console.log('Found files:', files);

const broken = 'if (!dependencyConfig.root) {';
const fixed = "if (!dependencyConfig || !dependencyConfig.root || typeof dependencyConfig.root !== 'string') {";

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  if (content.includes(broken)) {
    content = content.replace(broken, fixed);
    fs.writeFileSync(f, content);
    console.log('Patched:', f);
  } else if (content.includes(fixed)) {
    console.log('Already patched:', f);
  } else {
    console.log('Pattern not found in:', f);
    // Show what IS there around dependencyConfig
    const idx = content.indexOf('dependencyConfig');
    if (idx > -1) {
      console.log('  Context:', content.substring(idx - 20, idx + 100));
    }
  }
});

// Also check if there's a cached/compiled version
const cacheFiles = findFiles('./node_modules', 'generate-codegen-artifacts.js');
console.log('\nMain script files:', cacheFiles);
cacheFiles.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  console.log('  Content of', f, ':', content.substring(0, 300));
});
