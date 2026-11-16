# DevForge Development Standards & Conventions

## 1. Monorepo Organization & Tooling
- Package Manager: `pnpm` workspace.
- Language: TypeScript 5.4+ with `strict: true`.
- Node.js runtime: Node >= 20.x.
- Formatting & Linting: Prettier + ESLint with unified rules across all packages.

## 2. Coding Guidelines
- **Strict Typing:** Never use `any`. Use strict interfaces, generics, and algebraic data types or tagged unions.
- **Error Handling:** Avoid silent catches. Errors must be typed, logged with correlation IDs, and transformed to standard API responses.
- **Immutability:** Favor immutable state management, pure functions, and explicit side-effect boundaries.
- **Module Exports:** Every package exposes a single public barrel (`src/index.ts`) defining the exported API surface. Internal implementation files are strictly private to the package.
- **Unit and Integration Testing:** Every public service and utility must have accompanying unit and integration tests.

## 3. Git Workflow & Branch Conventions
- Main branch: `main` (protected).
- Development branch: `develop`.
- Agent-created remediation branches: `forge/<issue-id>-<short-description>`.
- Commit conventions: Conventional Commits (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`).
