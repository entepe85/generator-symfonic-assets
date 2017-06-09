module.exports = {
    entry: {
        app: ['./web-src/es6/app.js']
    },
    output: {
        //path: './dist/js',
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
