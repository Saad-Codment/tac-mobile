const fs = require('fs');
const path = require('path');

const p = './node_modules/react-native/scripts/codegen/generate-artifacts-executor.js';
const content = fs.readFileSync(p, 'utf8');

// Find the full findLibrariesFromReactNativeConfig function
const startIdx = content.indexOf('function findLibrariesFromReactNativeConfig');
const endIdx = content.indexOf('\nfunction ', startIdx + 10);
const fn = content.substring(startIdx, endIdx);

console.log('=== FULL FUNCTION ===');
console.log(fn);
console.log('=== END ===');

// Also find what happens with dependencies
const depIdx = content.indexOf('dependencies');
console.log('\n=== dependencies context ===');
console.log(content.substring(depIdx - 100, depIdx + 400));
