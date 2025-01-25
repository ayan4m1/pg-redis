import eslint from '@eslint/js';
import globals from 'globals';
import babelParser from '@babel/eslint-parser';
import eslintPluginImportX from 'eslint-plugin-import-x';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';

export default [
  eslint.configs.recommended,
  eslintPluginPrettier,
  eslintPluginImportX.flatConfigs.recommended,
  {
    files: ['**/__tests__/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest
      }
    }
  },
  {
    languageOptions: {
      globals: globals.node,
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        ecmaVersion: 2024
      }
    },
    settings: {
      'import-x/resolver': {
        node: {
          paths: ['./src']
        }
      }
    }
  }
];
