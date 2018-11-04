const merge = require('webpack-merge');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const common = require('./webpack.common.js');

process.env.NODE_ENV = 'production';

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new BundleAnalyzerPlugin({ analyzerMode: 'static', openAnalyzer: false }),
  ],
});
