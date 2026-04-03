# Vue3 Mobile Table Contributing Guide

Hi! Thank you for choosing Vue3 Mobile Table.

We are excited that you are interested in contributing to Vue3 Mobile Table. Before submitting your contribution though, please make sure to take a moment and read through the following guidelines.

## Issue Guidelines

- Issues are exclusively for bug reports, feature requests and design-related topics. Other questions may be closed directly.

- Before submitting an issue, please check if a similar problem has already been reported.

- Please specify which version of `vue3-mobile-table` and `Vue` you are using, and provide OS and browser information. A minimal reproduction is recommended.

## Pull Request Guidelines

- Fork this repository to your own account. Do not create branches here.

- Commit info should be formatted as `type(scope): description`. (e.g. `fix(directive): resolve edge detection bug`)
  1. **type**: must be one of [feat, fix, docs, style, refactor, perf, test, build, ci, chore]
  2. **scope**: must be one of [core, directive, utils, docs, ci, build, test, project]
  3. **description**: must not be longer than 72 characters

- Make sure that running `pnpm build` outputs the correct files.

- Rebase before creating a PR to keep commit history clear.

- Make sure PRs are created against the `main` branch.

- If your PR fixes a bug, please provide a description about the related bug.

## Development Setup

### Prerequisites

- Node.js >= 20
- pnpm >= 10

### Clone the repository

```bash
git clone https://github.com/LostElkByte/vue3-mobile-table.git
cd vue3-mobile-table
```

### Install dependencies

```bash
pnpm install
```

### Common development commands

```bash
# Start the playground dev server
pnpm dev

# Run tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Generate test coverage report
pnpm test:coverage

# Lint
pnpm lint

# Lint and auto-fix
pnpm lint:fix

# Type check
pnpm typecheck

# Build the project
pnpm build

# Format code
pnpm format
```

## Development Workflow

### 1. Create a feature branch

Create a new branch from `main`:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 2. Development

- Follow the existing code style
- Add necessary test cases
- Ensure all tests are passing
- Update relevant documentation

### 3. Commit your changes

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```bash
# Feature
git commit -m "feat: add new feature"

# Fix
git commit -m "fix: resolve bug in directive"

# Docs
git commit -m "docs: update README"

# Style
git commit -m "style: format code"

# Refactor
git commit -m "refactor: improve performance"

# Test
git commit -m "test: add unit tests"

# Build
git commit -m "build: update dependencies"

# CI
git commit -m "ci: update workflow"
```

### 4. Push and create a Pull Request

```bash
git push origin feature/your-feature-name
```

Then open a Pull Request on GitHub.

## Pull Request Guidelines

### PR Title

Use the Conventional Commits format:

- `feat: add new feature`
- `fix: resolve issue`
- `docs: update documentation`

### PR Description

Please include:

1. **Changes**: a brief summary of what you did
2. **Motivation**: why this change is needed
3. **Testing**: how you tested the change
4. **Screenshots** (if applicable): screenshots for UI changes

### PR Checklist

- [ ] Code follows the project style guides
- [ ] Tests have been added/updated
- [ ] All tests are passing
- [ ] Related documentation has been updated
- [ ] Commit messages follow the conventions
- [ ] `pnpm lint` and `pnpm typecheck` have been run locally

## Testing Guidelines

### Writing tests

Test files are located in `packages/vue3-mobile-table/__tests__/`:

```typescript
import { describe, expect, it } from 'vitest'
import { vMobileTable } from '../index'

describe('Feature Name', () => {
  it('should do something', () => {
    // test code
    expect(result).toBe(expected)
  })
})
```

### Running tests

```bash
# Run all tests
pnpm test

# Run a specific test file
pnpm test directive.test.ts

# Generate coverage report
pnpm test:coverage
```

## Code Style

This project uses:

- **ESLint** - linting
- **Prettier** - code formatting
- **TypeScript** - type checking

Before committing, please run:

```bash
pnpm lint:fix
pnpm format
```

## Project Structure

```
vue3-mobile-table/
├── packages/
│   └── vue3-mobile-table/      # main package (directive, types, presets, tests)
├── internal/
│   ├── build/                   # build pipeline and tasks
│   ├── build-constants/         # shared build constants
│   └── eslint-config/           # shared ESLint config
├── docs/                        # documentation site
├── play/                        # development playground
└── .github/
    └── workflows/              # CI/CD workflows
```

## Release Process

Releases are handled by the maintainers:

1. Bump the version number
2. Update the CHANGELOG
3. Create a Git tag
4. GitHub Actions will automatically publish to NPM

## Need Help?

- 📖 Read the [documentation](https://github.com/LostElkByte/vue3-mobile-table)
- 💬 Open an [Issue](https://github.com/LostElkByte/vue3-mobile-table/issues)
- 📧 Contact the maintainers

## Code of Conduct

Please follow our [Code of Conduct](CODE_OF_CONDUCT.md) and help us maintain a friendly and respectful community.

Thank you for your contribution! 🎉
