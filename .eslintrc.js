const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  parser: 'babel-eslint',
  env: { browser: true, node: true },
  extends: [
    'airbnb',
    'plugin:flowtype/recommended',
    'prettier',
    'prettier/flowtype',
    'prettier/react',
    'prettier/standard',
  ],
  env: {
    'cypress/globals': true,
    jest: true,
  },
  plugins: ['react', 'prettier', 'flowtype', 'cypress'],
  rules: {
    'flowtype/sort-keys': [
      ERROR,
      'asc',
      { caseSensitive: true, natural: false },
    ],
    'import/order': [WARN, { 'newlines-between': 'always' }],
    'react/destructuring-assignment': OFF,
    'react/jsx-sort-props': ERROR,
    'no-underscore-dangle': OFF,
    'prettier/prettier': [
      ERROR,
      {
        singleQuote: true,
        trailingComma: 'all',
        bracketSpacing: true,
        jsxBracketSameLine: false,
      },
    ],
  },
};
