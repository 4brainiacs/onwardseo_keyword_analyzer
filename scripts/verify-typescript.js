import { execSync } from 'child_process';

function verifyTypeScript() {
  console.log('🔍 Verifying TypeScript setup...\n');

  try {
    // Check TypeScript installation
    execSync('npx tsc --version', { stdio: 'inherit' });
    console.log('✅ TypeScript is properly installed\n');

    // Run type checking
    console.log('Running type check...');
    execSync('npx tsc --noEmit', { stdio: 'inherit' });
    console.log('✅ TypeScript validation passed\n');

    return true;
  } catch (error) {
    console.error('❌ TypeScript verification failed:', error.message);
    return false;
  }
}

if (!verifyTypeScript()) {
  process.exit(1);
}