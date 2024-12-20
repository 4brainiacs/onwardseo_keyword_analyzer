import { existsSync } from 'fs';
import { resolve } from 'path';

function verifyEnvironment() {
  console.log('🔍 Verifying environment setup...\n');

  // Check required files
  const requiredFiles = [
    'tsconfig.json',
    'tsconfig.node.json',
    'package.json',
    'vite.config.ts'
  ];

  const missingFiles = requiredFiles.filter(file => !existsSync(resolve(file)));
  
  if (missingFiles.length > 0) {
    console.error('❌ Missing required files:', missingFiles.join(', '));
    return false;
  }

  // Check environment variables
  const requiredEnvVars = ['VITE_API_URL'];
  const missingEnvVars = requiredEnvVars.filter(env => !process.env[env]);

  if (missingEnvVars.length > 0) {
    console.warn('⚠️ Missing environment variables:', missingEnvVars.join(', '));
    console.warn('Using default values...');
  }

  console.log('✅ Environment verification passed\n');
  return true;
}

if (!verifyEnvironment()) {
  process.exit(1);
}