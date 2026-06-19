const fs = require('fs');
const path = require('path');
const nm = './node_modules';
const allPkgs = [];

fs.readdirSync(nm).forEach(pkg => {
  if (pkg.startsWith('@')) {
    const scopedPath = path.join(nm, pkg);
    try {
      fs.readdirSync(scopedPath).forEach(sub => {
        allPkgs.push(path.join(nm, pkg, sub));
      });
    } catch(e) {}
  } else {
    allPkgs.push(path.join(nm, pkg));
  }
});

allPkgs.forEach(pkgPath => {
  const cfgPath = path.join(pkgPath, 'react-native.config.js');
  if (!fs.existsSync(cfgPath)) return;
  try {
    delete require.cache[require.resolve(path.resolve(cfgPath))];
    const cfg = require(path.resolve(cfgPath));
    const iosPath = cfg && cfg.dependency && cfg.dependency.platforms && cfg.dependency.platforms.ios && cfg.dependency.platforms.ios.podspecPath;
    if (iosPath !== undefined) {
      path.join(pkgPath, iosPath);
    }
  } catch(e) {
    console.log('CRASHES ON:', pkgPath);
    console.log('  Reason:', e.message);
  }
});
console.log('Scan done');
