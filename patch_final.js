const fs = require('fs');

const p = './node_modules/react-native/scripts/codegen/generate-artifacts-executor.js';
const content = fs.readFileSync(p, 'utf8');

// Show the exact patched area
const idx = content.indexOf('dependencyConfig');
console.log('=== Current state of dependencyConfig check ===');
console.log(content.substring(idx - 50, idx + 250));
console.log('');

// Check if old pattern still exists anywhere
const oldPattern = 'if (!dependencyConfig.root)';
const newPattern = "if (!dependencyConfig || !dependencyConfig.root || typeof dependencyConfig.root !== 'string')";

console.log('Old pattern exists:', content.includes(oldPattern));
console.log('New pattern exists:', content.includes(newPattern));

// Now completely replace the entire function with a safe version
const funcStart = content.indexOf('function findLibrariesFromReactNativeConfig');
const funcEnd = content.indexOf('\nfunction ', funcStart + 10);
const originalFunc = content.substring(funcStart, funcEnd);

console.log('\n=== Current full function ===');
console.log(originalFunc);

// Write a completely safe replacement
const safeFunc = `function findLibrariesFromReactNativeConfig(projectRoot) {
  const rnConfigFileName = 'react-native.config.js';
  codegenLog(
    \`Searching for codegen-enabled libraries in \${rnConfigFileName}\`,
    true,
  );
  const rnConfigFilePath = path.resolve(projectRoot, rnConfigFileName);
  if (!fs.existsSync(rnConfigFilePath)) {
    return [];
  }
  let rnConfig;
  try {
    rnConfig = require(rnConfigFilePath);
  } catch (e) {
    return [];
  }
  if (rnConfig == null || rnConfig.dependencies == null) {
    return [];
  }
  return Object.keys(rnConfig.dependencies).flatMap(name => {
    try {
      const dependencyConfig = rnConfig.dependencies[name];
      if (dependencyConfig == null || dependencyConfig.root == null || typeof dependencyConfig.root !== 'string') {
        return [];
      }
      const codegenConfigFileDir = path.resolve(
        projectRoot,
        dependencyConfig.root,
      );
      let configFile;
      try {
        configFile = readPkgJsonInDirectory(codegenConfigFileDir);
      } catch {
        return [];
      }
      return extractLibrariesFromJSON(configFile, codegenConfigFileDir);
    } catch (e) {
      return [];
    }
  });
}
`;

const newContent = content.substring(0, funcStart) + safeFunc + content.substring(funcEnd);
fs.writeFileSync(p, newContent);
console.log('\n=== Replaced entire function with safe version ===');

// Verify
const verify = fs.readFileSync(p, 'utf8');
const vIdx = verify.indexOf('function findLibrariesFromReactNativeConfig');
const vEnd = verify.indexOf('\nfunction ', vIdx + 10);
console.log('New function:');
console.log(verify.substring(vIdx, vEnd));
