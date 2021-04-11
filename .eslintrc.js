module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript',
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    'vue/name-property-casing': [2, 'PascalCase'],
    'vue/html-self-closing': [
      2,
      {
        html: {
          void: 'always'
        }
      }
    ],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 2,
    '@typescript-eslint/array-type': 2,
    '@typescript-eslint/ban-types': 2,
    '@typescript-eslint/no-empty-interface': 2,
    '@typescript-eslint/explicit-member-accessibility': 0,
    'no-console': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  },
  globals: {
    JSX: true
  }
}
