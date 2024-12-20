import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { resolve } from 'path';

function verifyBuild() {
  console.log('🔍 Running build verification...\n');

  // Check for required files
  const requiredFiles = [
    'tsconfig.json',
    'tsconfig.prod.json',
    'vite.config.ts',
    'package.json'
  ];

  const missingFiles = requiredFiles.filter(file => !existsSync(resolve(file)));
  if (missingFiles.length > 0) {
    console.error('❌ Missing required files:', missingFiles.join(', '));
    process.exit(1);
  }

  // Run type check
  console.log('Running type check...');
  if (!runCommand('npx tsc --noEmit')) {
    process.exit(1);
  }

  // Run ESLint
  console.log('\nRunning ESLint...');
  if (!runCommand('npm run lint')) {
    process.exit(1);
  }

  console.log('\n✅ Build verification passed!\n');
}

function runCommand(command) {
  try {
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`Command failed: ${command}`);
    return false;
  }
}

verifyBuild();