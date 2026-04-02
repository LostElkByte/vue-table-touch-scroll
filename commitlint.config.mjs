import { execSync } from 'child_process'
import { globSync } from 'tinyglobby'

const getPackages = (packagePath) =>
  globSync('*', { cwd: packagePath, onlyDirectories: true }).map((dir) =>
    dir.replace(/\/$/, '')
  )

const scopes = [
  ...getPackages('packages'),
  ...getPackages('internal'),
  'docs',
  'play',
  'project',
  'core',
  'utils',
  'ci',
  'dev',
  'deps',
  'types',
]

const gitStatus = execSync('git status --porcelain || true')
  .toString()
  .trim()
  .split('\n')

const scopeComplete = gitStatus
  .find((r) => ~r.indexOf('M  packages'))
  ?.replace(/\//g, '%%')
  ?.match(/packages%%((\w|-)*)/)?.[1]

const subjectComplete = gitStatus
  .find((r) => ~r.indexOf('M  packages'))
  ?.replace(/\//g, '%%')
  ?.match(/packages%%((\w|-)*)/)?.[1]

export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [2, 'always', scopes],
    'body-leading-blank': [1, 'always'],
    'footer-leading-blank': [1, 'always'],
    'header-max-length': [2, 'always', 100],
    'body-max-line-length': [2, 'always', 200],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-case': [
      1,
      'never',
      ['sentence-case', 'start-case', 'pascal-case', 'upper-case'],
    ],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      [
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'release',
        'style',
        'test',
        'improvement',
      ],
    ],
  },
  prompt: {
    defaultScope: scopeComplete,
    customScopesAlign: !scopeComplete ? 'top' : 'bottom',
    defaultSubject: subjectComplete && `[${subjectComplete}] `,
    allowCustomIssuePrefixs: false,
    allowEmptyIssuePrefixs: false,
  },
}
