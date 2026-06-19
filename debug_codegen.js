const fs = require('fs');
const path = require('path');

// Read the actual codegen script to find what it does with react-native.config.js
const codegenScript = fs.readFileSync(
  './node_modules/react-native/scripts/generate-codegen-artifacts.js',
  'utf8'
);

// Find the section that reads react-native.config.js
const lines = codegenScript.split('\n');
lines.forEach((line, i) => {
  if (
    line.includes('react-native.config') ||
    line.includes('rnconfig') ||
    line.includes('rn.config') ||
    line.includes('config.js')
  ) {
    console.log(`Line ${i + 1}: ${line}`);
  }
});

console.log('\n--- Now checking what the config returns ---');

// Load the root react-native.config.js
const rootCfg = require('./react-native.config.js');
console.log('Root config:', JSON.stringify(rootCfg, null, 2));

// Check if any library in the config has undefined paths
if (rootCfg.libraries) {
  rootCfg.libraries.forEach((lib, i) => {
    console.log(`Library ${i}:`, JSON.stringify(lib));
    if (lib.root === undefined) console.log(`  ^^^ root is undefined`);
    if (lib.name === undefined) console.log(`  ^^^ name is undefined`);
  });
}

// Now simulate what codegen does — look for the exact function
const match = codegenScript.match(/function.*?config.*?{[\s\S]*?}/);
if (match) {
  console.log('\nFound function:', match[0].substring(0, 200));
}
