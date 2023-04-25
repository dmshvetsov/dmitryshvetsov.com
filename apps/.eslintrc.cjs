module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "standard",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: [
    'react',
    '@typescript-eslint'
  ],
  settings: {
    react: {
      version: 'detect'
    }
  },
  ignorePatterns: [
    '.cache/',
    '.netlify/',
    'public/'
  ],
  rules: {
    'no-use-before-define': [0],
    '@typescript-eslint/no-use-before-define': [1]
  }
}
