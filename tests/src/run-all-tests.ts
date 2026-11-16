import { testWorkflowA } from './workflow-a.test';
import { testWorkflowB } from './workflow-b.test';
import { testSecurityAudit } from './security-audit.test';
import { testApiE2E } from './api-e2e.test';
import { testAuthSecurity } from './auth.test';

async function main() {
  console.log('\n================================================================');
  console.log('  DEVFORGE AUTOMATED PRODUCTION-READINESS VERIFICATION SUITE');
  console.log('================================================================\n');

  const suites = [
    testSecurityAudit,
    testAuthSecurity,
    testApiE2E,
    testWorkflowA,
    testWorkflowB
  ];

  let passed = 0;
  let failed = 0;

  for (const suite of suites) {
    const res = await suite();
    if (res.passed) {
      console.log(`[PASS] ${res.name}`);
      console.log(`       Evidence: ${res.details}\n`);
      passed++;
    } else {
      console.error(`[FAIL] ${res.name}`);
      console.error(`       Error: ${res.details}\n`);
      failed++;
    }
  }

  console.log('----------------------------------------------------------------');
  console.log(`Summary: ${passed} PASSED, ${failed} FAILED across ${suites.length} test suites.`);
  console.log('----------------------------------------------------------------\n');

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
