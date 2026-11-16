import { AuthGuard } from '../../apps/api/dist/common/guards/auth.guard';

export async function testAuthGuardSecurity(): Promise<{ name: string; passed: boolean; details: string }> {
  const testName = 'AuthGuard Production Enforcement Security Suite';
  const originalEnv = process.env.NODE_ENV;
  const originalBypass = process.env.DEVFORGE_ALLOW_DEV_AUTH;

  try {
    const guard = new AuthGuard();

    // 1. Test Production Rejection when header is missing
    process.env.NODE_ENV = 'production';
    delete process.env.DEVFORGE_ALLOW_DEV_AUTH;

    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {}
        })
      })
    } as any;

    let rejectedInProd = false;
    try {
      await guard.canActivate(mockExecutionContext);
    } catch {
      rejectedInProd = true;
    }

    if (!rejectedInProd) {
      throw new Error('AuthGuard failed to reject unauthenticated request in production mode');
    }

    // 2. Test Production Acceptance with valid Bearer token
    const mockValidContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'Bearer valid-jwt-token-123'
          }
        })
      })
    } as any;

    const validAllowed = await guard.canActivate(mockValidContext);
    if (!validAllowed) {
      throw new Error('AuthGuard failed to accept valid Bearer token in production mode');
    }

    return {
      name: testName,
      passed: true,
      details: 'AuthGuard successfully enforced in production. Missing headers throw 401 Unauthorized; valid Bearer tokens pass.'
    };
  } catch (err: any) {
    return {
      name: testName,
      passed: false,
      details: `FAILED: ${err.message}`
    };
  } finally {
    process.env.NODE_ENV = originalEnv;
    if (originalBypass) {
      process.env.DEVFORGE_ALLOW_DEV_AUTH = originalBypass;
    }
  }
}
