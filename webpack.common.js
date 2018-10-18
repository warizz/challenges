const path = require('path');

module.exports = {
  entry: './src/index.jsx',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build'),
    publicPath: 'build',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: [/node_modules/],
        use: { loader: 'babel-loader' },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
