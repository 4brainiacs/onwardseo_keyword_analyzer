import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

function validateBuild() {
  console.log('🔍 Running post-build validation...\n');

  // Validate index.html
  const indexPath = resolve('dist/index.html');
  const indexContent = readFileSync(indexPath, 'utf-8');

  // Check for critical elements
  const checks = [
    { test: /<div id="root">/i, message: 'Root element not found' },
    { test: /<script/i, message: 'Script tags not found' },
    { test: /type="module"/i, message: 'Module scripts not found' },
    { test: /<link.*rel="stylesheet"/i, message: 'Stylesheet not found' }
  ];

  const failures = checks.filter(({ test }) => !test.test(indexContent));
  
  if (failures.length > 0) {
    console.error('❌ Build validation failed:');
    failures.forEach(({ message }) => console.error(`  - ${message}`));
    process.exit(1);
  }

  console.log('✅ Post-build validation completed successfully!');
}

validateBuild();