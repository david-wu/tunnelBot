module.exports = {
    context: __dirname,
    entry: __dirname + '/client/main.js',
    output: {
        path: __dirname + '/client/dist',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.tpl.html$/,
                exclude: /(node_modules|dist)/,
                loader: 'raw-loader'
            },
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|dist)/,
                loader: 'babel'
            },
            {
                test: /\.scss$/,
                loaders: [
                    'style?sourceMap',
                    'css?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]',
                    'resolve-url',
                    'sass?sourceMap'
                ]
            },
        ],
    },
    watch: true,
    devtool: 'inline-source-map',
}