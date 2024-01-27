// .eslintrc.js
module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
      '@typescript-eslint',
      'import',
      'jsdoc',
      'prefer-arrow',
    ],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:import/typescript',
    ],
    rules: {
      // Your rules here
    },
  };
  