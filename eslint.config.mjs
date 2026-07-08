import eslintReact from '@eslint-react/eslint-plugin';
import js from '@eslint/js';
import tsEslint from 'typescript-eslint';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import-x';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import vitestGlobalsPlugin from 'eslint-plugin-vitest-globals';
import globals from 'globals';

const reactFiles = [ '**/*.{js,jsx,ts,tsx}' ];

export default [
  {
    ignores: [ 'build/**', 'report/**', 'test-results/**', 'src/generated/**' ],
  },
  js.configs.recommended,
  ...tsEslint.configs.recommended,
  { files: reactFiles, ...eslintReact.configs[ 'recommended-typescript' ] },
  reactHooksPlugin.configs.flat[ 'recommended-latest' ],
  { files: reactFiles, ...eslintReact.configs[ 'disable-conflict-eslint-plugin-react-hooks' ] },
  {
    files: reactFiles,
    rules: {
      '@eslint-react/exhaustive-deps': 'off',
      '@eslint-react/naming-convention-ref-name': 'off',
      '@eslint-react/dom-no-dangerously-set-innerhtml': 'off',
      '@eslint-react/no-context-provider': 'off',
      '@eslint-react/no-array-index-key': 'off',
      '@eslint-react/no-use-context': 'off',
      '@eslint-react/set-state-in-effect': 'off',
      '@eslint-react/no-forward-ref': 'off',
      '@eslint-react/use-state': 'off',
      '@eslint-react/no-clone-element': 'off',
      '@eslint-react/no-unnecessary-use-prefix': 'off',
    },
  },
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  vitestGlobalsPlugin.configs[ 'flat/recommended' ],
  prettierRecommended,
  {
    files: [ '**/*.{js,jsx,ts,tsx}' ],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2020,
      },
    },
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    settings: {
      'import-x/resolver': {
        typescript: { alwaysTryTypes: true },
      },
    },
    rules: {
      'brace-style': [ 'error', '1tbs', { allowSingleLine: true } ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      'func-call-spacing': 'error',
      '@typescript-eslint/member-ordering': 'warn',
      '@typescript-eslint/no-require-imports': 'error',
      '@typescript-eslint/no-unused-expressions': 'error',
      'array-bracket-spacing': [ 'warn', 'never' ],
      'max-len': [ 'warn', { code: 120 } ],
      'no-console': 'warn',
      'no-plusplus': 'error',
      'no-undef': 'warn',
      'no-unused-expressions': 'off',
      'object-curly-spacing': [ 'warn', 'always' ],
      'sort-imports': 'off',
      'import-x/order': 'off',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'import-x/named': 'off',
      'import-x/no-named-as-default': 'off',
      'import-x/no-named-as-default-member': 'off',
      'import-x/no-duplicates': 'off',
      'import-x/no-unresolved': 'error',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
    },
  },
];
