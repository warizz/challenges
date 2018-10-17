const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  parser: 'babel-eslint',
  env: { browser: true, node: true },
  extends: [
    'airbnb',
    'prettier',
    'prettier/react',
    'prettier/standard',
  ],
  plugins: ['react', 'prettier'],
  rules: {
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
