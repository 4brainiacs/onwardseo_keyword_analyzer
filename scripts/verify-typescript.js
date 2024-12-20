import { execSync } from 'child_process';

function verifyTypeScript() {
  console.log('🔍 Verifying TypeScript setup...\n');

  try {
    // Verify TypeScript is installed
    const tscVersion = execSync('npx tsc --version').toString();
    console.log('TypeScript version:', tscVersion);

    // Run type checking
    console.log('Running type check...');
    execSync('npx tsc --noEmit', { stdio: 'inherit' });
    
    console.log('✅ TypeScript validation passed\n');
    return true;
  } catch (error) {
    console.error('❌ TypeScript verification failed:', error.message);
    if (error.message.includes('not found')) {
      console.error('Please ensure TypeScript is installed: npm install typescript@5.3.3');
    }
    return false;
  }
}

if (!verifyTypeScript()) {
  process.exit(1);
}