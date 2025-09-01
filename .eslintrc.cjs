module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import', 'unused-imports', 'tailwindcss', 'react'],
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:react/recommended',
    'plugin:tailwindcss/recommended',
    'prettier',
  ],
  settings: {
    'import/resolver': { typescript: true },
    react: { version: 'detect' },
  },
  rules: {
    // Types
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/consistent-type-imports': 'warn',

    // Imports
    'import/order': ['warn', { 'newlines-between': 'always', alphabetize: { order: 'asc' } }],
    'unused-imports/no-unused-imports': 'warn',

    // React/Next
    'react/jsx-no-useless-fragment': 'warn',
    'react/no-unstable-nested-components': 'warn',

    // Tailwind
    'tailwindcss/classnames-order': 'warn',
    'tailwindcss/enforces-shorthand': 'warn',

    // General
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
};

