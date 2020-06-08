const path = require('path');
const DotEnvPlugin = require('dotenv-webpack');
const isDev = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: 'development',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
  },
  node: {
    __dirname: false,
    __filename: false,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
  },
  devtool: 'source-map',
  plugins: [
    new DotEnvPlugin({
      path: isDev ? './.env.dev' : './.env',
    }),
  ],
};
