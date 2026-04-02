# Contributing Guide

Thank you for your interest in contributing to Vue3 Mobile Table!

## Development Setup

1. **Fork and clone the repository**

```bash
git clone https://github.com/LostElkByte/vue3-mobile-table.git
cd vue3-mobile-table
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Start development server**

```bash
pnpm dev
```

## Project Structure

- `packages/core` - Core directive implementation
- `packages/utils` - Utility functions
- `packages/vue3-mobile-table` - Main package entry
- `internal/build` - Build toolchain
- `play` - Development playground
- `docs` - Documentation site

## Development Workflow

1. Create a new branch for your feature/fix
2. Make your changes
3. Add tests if applicable
4. Run tests: `pnpm test`
5. Run type checking: `pnpm typecheck`
6. Run linting: `pnpm lint`
7. Commit your changes (follow conventional commits)
8. Push and create a pull request

## Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

## Pull Request Guidelines

- Keep PRs focused on a single feature/fix
- Include tests for new features
- Update documentation if needed
- Ensure all tests pass
- Follow the existing code style

## Questions?

Feel free to open an issue for any questions or concerns.
