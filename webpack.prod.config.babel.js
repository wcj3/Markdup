module.exports = {
  devtool: 'cheap-source-map',
  entry: ['babel-polyfill', './src'],
  externals: {
    'highlight.js': {
      commonjs: 'highlight.js',
      commonjs2: 'highlight.js',
      amd: 'highlight.js',
    }
  },
  output: {
    path: __dirname + 'lib',
    filename: 'markdup.min.js',
    library: 'Markdup',
    libraryTarget: 'umd',
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: 'babel-loader',
    }, {
      test: /\.css$/,
      use: ['style-loader',
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            plugins: () => {
              return [
                require('cssnano'),
              ];
            }
          }
        }
      ],
    }, {
      test: /\.sss$/,
      use: ['style-loader', 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]', 'postcss-loader?parser=sugarss'],
    }],
  },
};
