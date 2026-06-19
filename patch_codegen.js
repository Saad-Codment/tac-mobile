const fs = require('fs');

const p = './node_modules/react-native/scripts/codegen/generate-artifacts-executor.js';
let content = fs.readFileSync(p, 'utf8');

const broken = 'if (!dependencyConfig.root) {';
const fixed = 'if (!dependencyConfig || !dependencyConfig.root || typeof dependencyConfig.root !== \'string\') {';

if (content.includes(broken)) {
  content = content.replace(broken, fixed);
  fs.writeFileSync(p, content);
  console.log('Patched successfully');
} else if (content.includes(fixed)) {
  console.log('Already patched');
} else {
  console.log('Pattern not found');
  const idx = content.indexOf('dependencyConfig');
  console.log('Context around dependencyConfig:', content.substring(idx - 50, idx + 200));
}
