module.exports = {
  mode: 'production',
  output: {
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: [['@babel/preset-env', { modules: false }]],
        },
      },
    ],
  },
  externals: {
    jquery: 'jQuery',
  },
};
