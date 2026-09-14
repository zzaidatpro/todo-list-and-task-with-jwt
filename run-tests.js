import { execSync } from 'child_process';

const testType = process.argv[2] || 'all';

function runCommand(command) {
  try {
    execSync(command, { stdio: 'inherit' });
  } catch {
    console.error(`\nÉchec de la commande : ${command}`);
    process.exit(1);
  }
}

switch (testType) {
  case 'unit':
    console.log('🧪 Exécution des Tests Unitaires (Redux)...');
    runCommand('npx vitest run src/redux');
    break;

  case 'integration':
    console.log('🧩 Exécution des Tests d\'Intégration (React + Store)...');
    runCommand('npx vitest run src/tests/integration');
    break;

  case 'e2e':
    console.log('🌐 Exécution des Tests E2E (Playwright)...');
    runCommand('npx playwright test e2e');
    break;

  case 'all':
    console.log('🚀 LANCEMENT DE LA SUITE COMPLÈTE DE TESTS\n');
    
    console.log('--- Step 1/3: Tests Unitaires ---');
    runCommand('npx vitest run src/redux');
    
    console.log('\n--- Step 2/3: Tests d\'Intégration ---');
    runCommand('npx vitest run src/tests/integration');
    
    console.log('\n--- Step 3/3: Tests E2E ---');
    runCommand('npx playwright test e2e');
    
    console.log('\n🎉 TOUS LES TESTS SONT AU VERT ! PIPELINE VALIDÉ.');
    break;

  default:
    console.log('Usage: node run-tests.js [unit|integration|e2e|all]');
    break;
}