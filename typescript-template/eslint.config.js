import stylistic from '@stylistic/eslint-plugin';
import checkFile from 'eslint-plugin-check-file';
import tseslint from 'typescript-eslint';
import requireUsedReturnValue from './eslint-rules/require-used-return-value.js';

export default [
  {
    ignores: ['**/dist/**', '**/coverage/**', '**/node_modules/**'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.eslint.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@stylistic': stylistic,
      '@typescript-eslint': tseslint.plugin,
      'check-file': checkFile,
      local: { rules: { 'require-used-return-value': requireUsedReturnValue } },
    },
    rules: {
      'local/require-used-return-value': 'warn',
      'no-restricted-syntax': [
        'warn',
        {
          selector: 'ThrowStatement',
          message: 'Do not use throw statements.',
        },
      ],
      'check-file/filename-naming-convention': [
        'warn',
        { '**/*.{ts,tsx,mts,cts}': 'KEBAB_CASE' },
        { ignoreMiddleExtensions: true },
      ],
      '@stylistic/quotes': ['warn', 'backtick'],
      '@typescript-eslint/naming-convention': [
        'warn',
        { selector: 'default', format: ['camelCase'] },
        { selector: 'typeLike', format: ['PascalCase'] },
        { selector: 'import', format: ['camelCase', 'PascalCase'] },
        {
          selector: 'variable',
          modifiers: ['const'],
          format: ['camelCase', 'UPPER_CASE'],
        },
        {
          selector: 'parameter',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
        },
        {
          selector: 'memberLike',
          modifiers: ['requiresQuotes'],
          format: null,
        },
        // Use a targeted eslint-disable for property names required by external APIs.
      ],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
];
