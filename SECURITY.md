# Security Policy

## Supported Versions

Only the latest released version is currently receiving security updates. For older versions, we recommend upgrading to the latest version to receive security fixes.

## Reporting a Vulnerability

If you discover a security vulnerability, **please do not** report it in a public issue.

### How to Report

Please report security vulnerabilities through one of the following methods:

1. **Send an email**: [security@example.com](mailto:security@example.com)
2. **Use GitHub Security Advisory**: Visit [GitHub Security Advisories](https://github.com/LostElkByte/vue3-mobile-table/security/advisories) to create a new private report

### What to Include

Please include as much of the following information as possible:

- Detailed description of the vulnerability
- Affected versions
- Steps to reproduce (if applicable)
- Potential impact
- Suggested fix (if available)

### Response Time

We will acknowledge receipt of your report within **48 hours** and provide an initial assessment or fix plan within **7 days**.

## Security Best Practices

### Dependency Management

This project uses pnpm as the package manager and regularly updates dependencies to fix known security vulnerabilities. We recommend:

- Running `pnpm audit` regularly to check for dependency security issues
- Updating to the latest version in a timely manner
- Keeping an eye on security advisories for dependencies

### Code Review

All code changes go through a strict code review process:

- Pull Requests must receive approval from at least one maintainer
- All changes must pass CI/CD checks
- Security-related changes require additional review

### CI/CD Security

Our CI/CD pipeline includes the following security measures:

- Code quality checks (ESLint)
- Type checking (TypeScript)
- Automated testing
- Dependency security scanning

## Security Updates

When a security vulnerability is discovered, we will:

1. Confirm the vulnerability and assess its impact
2. Develop and test a fix
3. Release a security update
4. Publish a security advisory on GitHub Security Advisories
5. Notify users to upgrade

## Security Resources

- [GitHub Security Advisories](https://github.com/LostElkByte/vue3-mobile-table/security/advisories)
- [npm Audit](https://docs.npmjs.com/cli/v7/commands/npm-audit)
- [Node.js Security](https://nodejs.org/en/docs/guides/security/)

## Contact

If you have any security concerns or questions, please contact us via:

- GitHub: [@LostElkByte](https://github.com/LostElkByte)

## Acknowledgments

We would like to thank all researchers and users who help us discover and fix security vulnerabilities. Your contributions make this project more secure!
