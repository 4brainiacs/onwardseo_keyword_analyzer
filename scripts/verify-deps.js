import { execSync } from 'child_process';

function verifyDependencies() {
  console.log('🔍 Verifying dependencies...\n');

  const requiredDeps = [
    'typescript@5.3.3',
    'react@18.2.0',
    'react-dom@18.2.0',
    'vite@5.4.11'
  ];

  try {
    requiredDeps.forEach(dep => {
      const [name, version] = dep.split('@');
      console.log(`Checking ${name}@${version}...`);
      execSync(`npm list ${name}@${version}`, { stdio: 'pipe' });
    });

    console.log('✅ Dependencies verification passed\n');
    return true;
  } catch (error) {
    console.error('❌ Dependencies verification failed');
    console.error('Please run: npm install');
    return false;
  }
}

if (!verifyDependencies()) {
  process.exit(1);
}