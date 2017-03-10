module.exports = {
  devtool: 'cheap-source-map',
  entry: ['babel-polyfill', './src'],
  output: {
    path: 'lib',
    filename: 'markdup.min.js',
    library: 'Markdup',
    libraryTarget: 'var',
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
