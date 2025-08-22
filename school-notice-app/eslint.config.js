import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
// ESLint flat config setup

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    ...js.configs.recommended,
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  // Configuration for Node.js files (like vite.config.js)
  {
    files: ['vite.config*.js', '*.config.js'],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.node,
        __dirname: 'readonly',
        process: 'readonly',
      },
    },
  },
]
