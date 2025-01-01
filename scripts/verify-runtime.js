import { execSync } from 'child_process';

function verifyRuntime() {
  console.log('🔍 Verifying runtime environment...\n');

  try {
    // Check Node.js version
    const nodeVersion = process.version;
    console.log('Node.js version:', nodeVersion);
    if (!nodeVersion.startsWith('v18')) {
      throw new Error('Node.js 18.x is required');
    }

    // Check npm version
    const npmVersion = execSync('npm --version').toString().trim();
    console.log('npm version:', npmVersion);
    if (!npmVersion.startsWith('9')) {
      throw new Error('npm 9.x is required');
    }

    console.log('✅ Runtime verification passed\n');
    return true;
  } catch (error) {
    console.error('❌ Runtime verification failed:', error.message);
    return false;
  }
}

if (!verifyRuntime()) {
  process.exit(1);
}