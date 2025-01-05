/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Hammed Abass. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import stylisticTs from '@stylistic/eslint-plugin-ts';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import eslintConfigPrettier from 'eslint-config-prettier';
import pluginHeader from 'eslint-plugin-header';
import importPlugin from 'eslint-plugin-import';
import pluginJsdoc from 'eslint-plugin-jsdoc';
import tseslint from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const ignores = fs
  .readFileSync(path.join(__dirname, '.eslint-ignore'), 'utf-8')
  .toString()
  .split(/\r?\n/) // Correctly splits by newline characters (cross-platform)
  .filter(line => line && !line.startsWith('#'));

export default tseslint.config(
  (pluginHeader.rules.header.meta.schema = false),
  ...compat.extends('eslint:recommended', 'plugin:@typescript-eslint/recommended'),
  {
    ignores,
  },
  {
    languageOptions: {
      parser: tseslint.parser,
    },
    plugins: {
      header: pluginHeader,
    },
    rules: {
      'constructor-super': 'warn',
      curly: 'warn',
      eqeqeq: 'warn',
      'prefer-const': [
        'warn',
        {
          destructuring: 'all',
        },
      ],
      'no-buffer-constructor': 'warn',
      'no-caller': 'warn',
      'no-case-declarations': 'warn',
      'no-debugger': 'warn',
      'no-duplicate-case': 'warn',
      'no-duplicate-imports': 'warn',
      'no-eval': 'warn',
      'no-async-promise-executor': 'warn',
      'no-extra-semi': 'warn',
      'no-new-wrappers': 'warn',
      'no-redeclare': 'off',
      'no-sparse-arrays': 'warn',
      'no-throw-literal': 'warn',
      'no-unsafe-finally': 'warn',
      'no-unused-labels': 'warn',
      'no-misleading-character-class': 'warn',
      'no-restricted-globals': [
        'warn',
        'name',
        'length',
        'event',
        'closed',
        'external',
        'status',
        'origin',
        'orientation',
        'context',
      ], // non-complete list of globals that are easy to access unintentionally
      'no-var': 'warn',
      semi: 'off',
      'header/header': [
        2,
        'block',
        [
          '---------------------------------------------------------------------------------------------',
          ' *  Copyright (c) Hammed Abass. All rights reserved.',
          ' *  Licensed under the MIT License. See License.txt in the project root for license information.',
          ' *--------------------------------------------------------------------------------------------',
        ],
      ],
    },
  },
  // TS
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
    },
    plugins: {
      '@stylistic/ts': stylisticTs,
      '@typescript-eslint': tseslint.plugin,
      jsdoc: pluginJsdoc,
    },
    rules: {
      '@stylistic/ts/semi': 'warn',
      '@stylistic/ts/member-delimiter-style': 'warn',
      'jsdoc/no-types': 'warn',
    },
  },
  importPlugin.flatConfigs.recommended,
  ...compat.extends('eslint:recommended', 'plugin:@typescript-eslint/recommended'),
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
      'import/no-dynamic-require': 'warn',
      'import/no-unresolved': 'off',
      'import/no-cycle': 'error',

      'no-console': [
        'error',
        {
          allow: ['warn', 'error'],
        },
      ],

      curly: 'warn',
      eqeqeq: 'error',
      'no-eq-null': 'error',
      'no-use-before-define': ['error', 'nofunc'],

      'brace-style': [
        'error',
        '1tbs',
        {
          allowSingleLine: true,
        },
      ],

      'comma-dangle': ['error', 'always-multiline'],
      'comma-spacing': 'error',
      'comma-style': 'error',
      'func-call-spacing': 'error',

      indent: [
        'error',
        2,
        {
          SwitchCase: 1,
          MemberExpression: 1,
        },
      ],

      'key-spacing': [
        'error',
        {
          mode: 'minimum',
        },
      ],

      'keyword-spacing': 'error',
      'object-curly-spacing': ['error', 'always'],
      'one-var': ['error', 'never'],

      quotes: [
        'error',
        'single',
        {
          allowTemplateLiterals: true,
        },
      ],

      semi: ['error', 'always'],

      'space-before-function-paren': [
        'error',
        {
          anonymous: 'never',
          named: 'never',
          asyncArrow: 'always',
        },
      ],

      'space-infix-ops': 'error',
      'arrow-body-style': ['error', 'as-needed'],
      'arrow-parens': ['error', 'as-needed'],
      'arrow-spacing': 'error',
      'no-duplicate-imports': 'error',
      'no-useless-constructor': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-template': 'error',
    },
  },
  eslintConfigPrettier,
);
