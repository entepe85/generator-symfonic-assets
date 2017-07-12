module.exports = {
    entry: {
      app: ['./web-src/es6/app.js'<% if (useJQuery || useBootstrap) { %>, './web-src/js/dist/libs.all.js'<% } %>]
    },
    output: {
      filename: 'bundle.js'
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          query: {
              presets: ['es2015']
          }
        }
      ]
    }
};
