const fs = require('fs');
const path = require('path');

const fix = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      fix(full);
    } else if (full.endsWith('.tsx') || full.endsWith('.ts')) {
      let original = fs.readFileSync(full, 'utf8');
      let current = original;
      current = current.replace(/\\\${/g, '${');
      current = current.replace(/\\`/g, '`');
      if (current !== original) {
        fs.writeFileSync(full, current);
        console.log('Fixed:', full);
      }
    }
  }
};

fix(path.join(process.cwd(), 'app'));
fix(path.join(process.cwd(), 'components'));
