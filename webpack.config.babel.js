module.exports = {
  entry: ['babel-polyfill', './src'],
  externals: {
    'highlight.js': {
      commonjs: 'highlight.js',
      commonjs2: 'highlight.js',
      amd: 'highlight.js',
    }
  },
  output: {
    path: __dirname + './tmp',
    filename: 'markdup.js',
    library: 'Markdup',
    libraryTarget: 'umd',
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
