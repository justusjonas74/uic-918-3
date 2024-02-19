/* eslint-env node */
module.exports = {
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/eslint-recommended',
      'plugin:@typescript-eslint/recommended',
      // 'prettier'
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'jest'],
    root: true,
    env: {
      browser: false,
      es6: true,
      node: true,
    },
    rules:{
      "@typescript-eslint/explicit-function-return-type": 1
    }
  };