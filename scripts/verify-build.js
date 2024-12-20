import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { resolve } from 'path';

function runCommand(command) {
  try {
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`Command failed: ${command}`);
    console.error(error);
    return false;
  }
}

function verifyBuild() {
  console.log('🔍 Running build verification...\n');

  // Check TypeScript
  console.log('Checking TypeScript...');
  if (!runCommand('npm run typecheck')) {
    process.exit(1);
  }

  // Run ESLint
  console.log('\nRunning ESLint...');
  if (!runCommand('npm run lint')) {
    process.exit(1);
  }

  // Clean and build
  console.log('\nCleaning build directory...');
  runCommand('npm run clean');

  console.log('\nBuilding project...');
  if (!runCommand('npm run build')) {
    process.exit(1);
  }

  // Verify build output
  const distDir = resolve('dist');
  if (!existsSync(distDir)) {
    console.error('❌ Build failed: dist directory not found');
    process.exit(1);
  }

  console.log('\n✅ Build verification completed successfully!');
}

verifyBuild();