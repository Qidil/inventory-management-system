const js = require('@eslint/js')

module.exports = [
  js.configs.recommended,
  {
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
      globals: {
        process: 'readonly',
        console: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
        module: 'readonly',
      },
    },
    ignores: ['node_modules/', 'migrations/', 'seeders/'],
  },
]