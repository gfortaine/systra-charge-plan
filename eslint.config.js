import eslint from '@eslint/js'
import globals from 'globals'
import reactPlugin from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import stylistic from '@stylistic/eslint-plugin'

export default [
  {
    ignores: [
      '.venv',
      '.gitlab-ci-local',
      'node_modules',
      'front/dist',
      'front/static',
      'build',
      'back',
      'reports',
      'docker',
    ],
  },
  eslint.configs.recommended,
  reactPlugin.configs.flat['recommended'],
  reactPlugin.configs.flat['jsx-runtime'],
  reactHooks.configs.flat['recommended-latest'],
  reactRefresh.configs.vite,
  stylistic.configs['recommended'],
  {
    files: [
      '**/*.js',
      '**/*.mjs',
      '**/*.cjs',
      '**/*.jsx',
    ],
    settings: {
      react: {
        version: 'detect',
      },
    },
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest', // default
        sourceType: 'module', // default
        requireConfigFile: false,
      },
      globals: globals.browser,
    },
    rules: {
      '@stylistic/arrow-parens': 'off',
      '@stylistic/brace-style': 'off',
      '@stylistic/indent': ['error', 2],
      '@stylistic/multiline-ternary': 'off',
      '@stylistic/semi': 'error',
      '@stylistic/space-before-function-paren': 'off',
      '@stylistic/jsx-one-expression-per-line': ['error', { allow: 'non-jsx' }],
      'comma-dangle': ['warn', 'always-multiline'],
      'curly': 'error',
      'max-len': ['warn', { code: 120 }],
      'no-irregular-whitespace': 'off',
      'no-prototype-builtins': 'off',
      'no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          args: 'after-used',
        },
      ],
      'no-warning-comments': [
        'warn',
        {
          terms: ['TODO', 'FIXME'],
          location: 'anywhere',
        },
      ],
      'quote-props': ['warn', 'as-needed', { unnecessary: false }],
      'react/prop-types': 'off',
    },
  },
]
