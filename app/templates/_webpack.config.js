module.exports = {
    entry: {
      app: ['./web-src/es6/app.js']<% if (useJQuery || useBootstrap) { %>,
      libs: ['./web-src/js/dist/libs.all.js']
      <% } %>
    },
    output: {
      <% if (useJQuery || useBootstrap) { %>
        path: '/web/js'
      <% } else { %>
        filename: 'bundle.js'
      <% } %>
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
