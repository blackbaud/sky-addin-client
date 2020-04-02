var path = require('path');

module.exports = {
  entry: './index.ts',
  output: {
    path: path.resolve(__dirname, '..', '..', 'dist', 'bundles'),
    filename: 'sky-addin-client.umd.js',
    library: 'BBSkyAddinClient',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['.ts']
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          compilerOptions: {
            declaration: false
          }
        }
      }
    ]
  }
};
