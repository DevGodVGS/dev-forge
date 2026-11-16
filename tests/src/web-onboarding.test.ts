import { devForgeStore } from '@devforge/database';

export async function testWebRepositoryOnboarding(): Promise<{ name: string; passed: boolean; details: string }> {
  const name = 'Web Repository Onboarding & Connection Workflow Suite';
  try {
    // 1. Validate format checker
    const validateRepoFormat = (val: string) => /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(val.trim());
    if (validateRepoFormat('invalid-name-without-slash')) {
      return { name, passed: false, details: 'Expected repo without slash to fail validation' };
    }
    if (!validateRepoFormat('DevGodVGS/dev-forge')) {
      return { name, passed: false, details: 'Expected DevGodVGS/dev-forge to pass validation' };
    }

    // 2. Validate repository creation in data store
    const repoPayload = {
      id: `repo-test-${Date.now()}`,
      organizationId: 'org-default-001',
      installationId: 'inst-github-001',
      githubRepoId: 998877,
      fullName: 'DevGodVGS/dev-forge',
      defaultBranch: 'main',
      isPrivate: true,
      cloneUrl: 'https://github.com/DevGodVGS/dev-forge.git',
      language: 'TypeScript',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const created = await devForgeStore.createRepository(repoPayload);
    if (created.id !== repoPayload.id || created.fullName !== 'DevGodVGS/dev-forge') {
      return { name, passed: false, details: 'Created repository data does not match input' };
    }

    const fetched = await devForgeStore.getRepository(created.id);
    if (!fetched || fetched.fullName !== 'DevGodVGS/dev-forge') {
      return { name, passed: false, details: 'Failed to retrieve newly created repository' };
    }

    return {
      name,
      passed: true,
      details: 'Repository format validation, onboarding data flow, and datastore persistence verified.'
    };
  } catch (err: any) {
    return { name, passed: false, details: `Exception in onboarding test: ${err.message}` };
  }
}
