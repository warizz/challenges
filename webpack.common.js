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
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
        include: [/flexboxgrid/, /react-toastify/],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
