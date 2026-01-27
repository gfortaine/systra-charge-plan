export default {
  extends: [
    'stylelint-config-standard-scss',
  ],
  rules: {
    'rule-empty-line-before': 'never-multi-line',
    'declaration-block-no-redundant-longhand-properties': null,
    'declaration-property-value-no-unknown': null,
  },
  ignoreFiles: [
    '.venv/**',
    '.gitlab-ci-local/**',
    'back/**',
    'node_modules/**',
    'reports/**',
    'front/dist/**',
    'front/tests/**',
  ],
}
