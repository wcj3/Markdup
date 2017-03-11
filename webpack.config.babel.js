module.exports = {
  entry: ['babel-polyfill', './src'],
  output: {
    path: 'tmp',
    filename: 'markdup.js',
    library: 'Markdup',
    libraryTarget: 'var',
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: 'babel-loader',
    }, {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    }, {
      test: /\.sss$/,
      use: ['style-loader', 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]', 'postcss-loader?parser=sugarss'],
    }],
  },
};
