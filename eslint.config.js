import eslint from '@eslint/js'
import graphqlPlugin from '@graphql-eslint/eslint-plugin'
import stylistic from '@stylistic/eslint-plugin'
import { defineConfig, globalIgnores } from 'eslint/config'
import importPlugin from 'eslint-plugin-import'
import reactPlugin from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'

export default defineConfig([
  globalIgnores([
    '.venv/',
    '.gitlab-ci-local/',
    'node_modules/',
    'front/dist/',
    'front/static/',
    'docs/',
    'build/',
    'back/',
    'reports/',
    'docker/',
  ]),
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  eslint.configs.recommended,
  importPlugin.flatConfigs['react'],
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
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest', // default
        sourceType: 'module', // default
        requireConfigFile: false,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'import/extensions': [
        'error',
        {
          js: 'never',
          jsx: 'never',
          mjs: 'never',
          json: 'always',
          css: 'always',
          scss: 'always',
          graphql: 'always',
        },
      ],
      'import/newline-after-import': 'error',
      'import/order': [
        'error',
        {
          'groups': ['builtin', 'external', 'internal', 'parent', 'sibling'],
          'pathGroups': [
            {
              pattern: '{react,react/*,react-*,react-*/*}',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@{src,page,comp,scss,static,test}/**',
              group: 'internal',
            },
          ],
          'pathGroupsExcludedImportTypes': [],
          'newlines-between': 'never',
          'alphabetize': {
            order: 'asc',
            caseInsensitive: true,
          },
          'named': true,
        },
      ],
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
  {
    files: [
      'front/src/config.js',
    ],
    rules: {
      'max-len': 'off',
    },
  },
  {
    files: ['front/**/*.graphql'],
    languageOptions: {
      parser: graphqlPlugin.parser,
      parserOptions: {
        graphQLConfig: {
          schema: import.meta.dirname + '/docs/schema.graphql',
          documents: import.meta.dirname + '/front/src/graphql/**/*.graphql',
        },
      },
    },
    plugins: {
      '@graphql-eslint': graphqlPlugin,
    },
    rules: {
      ...graphqlPlugin.configs['flat/operations-recommended'].rules,
      '@graphql-eslint/match-document-filename': [
        'error',
        {
          fileExtension: '.graphql',
          fragment: { style: 'PascalCase', suffix: '.fragment' },
          query: { style: 'PascalCase', suffix: '.query' },
          mutation: { style: 'PascalCase', suffix: '.mutation' },
        },
      ],
      '@graphql-eslint/require-import-fragment': 'error',
    },
  },
])
