import { getPrismaClient, checkDatabaseHealth } from '@devforge/database';

export async function testDbPrisma(): Promise<{ name: string; passed: boolean; details: string }> {
  const testName = 'Database Prisma Client Singleton & Health Check Suite';
  try {
    const client = getPrismaClient();
    if (!client) {
      throw new Error('getPrismaClient returned null or undefined');
    }

    const health = await checkDatabaseHealth();
    if (!health.connected) {
      throw new Error(`Database health check failed: ${health.error}`);
    }

    return {
      name: testName,
      passed: true,
      details: `PrismaClient singleton instantiated successfully. Health check verified (latency: ${health.latencyMs}ms).`
    };
  } catch (err: any) {
    return {
      name: testName,
      passed: false,
      details: `FAILED: ${err.message}`
    };
  }
}
