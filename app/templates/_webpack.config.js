<% if (useJQuery || useBootstrap || useUIKit) { %>var webpack = require('webpack');<% } %>

module.exports = {
  entry: {
    app: [<% if (useJQuery || useBootstrap || useUIKit) { %> './web-src/js/dist/libs.all.js', <% } %>'./web-src/es6/app.js']
  },
  output: {
    filename: 'app.js'
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
  }<% if (useJQuery || useBootstrap || useUIKit) { %>,
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jquery: "jquery",
      "window.jQuery": "jquery",
      jQuery:"jquery"
    })
  ]<% } %>
};
