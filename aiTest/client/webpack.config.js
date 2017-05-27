const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    context: __dirname,
    entry: __dirname + '/app/main.ts',
    output: {
        path: __dirname + '/app/dist',
        publicPath: '/assets/',
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['', '.ts', '.js']
    },
    module: {
        loaders: [
            {
                test: /(\.tpl.html|\.txt)$/,
                exclude: /(node_modules|dist)/,
                loader: 'raw-loader'
            },
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|dist)/,
                loader: 'babel'
            },
            {
                test: /\.tsx?$/,
                exclude: /(node_modules|dist)/,
                loader: 'babel!ts-loader'
            },
            {
                test: /\.scss$/,
                exclude: /(node_modules|dist)/,
                loaders: [
                    // ExtractTextPlugin.extract('sass-loader')
                    // 'sass-loader?sourceMap',
                    'raw-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ],
    },
    watch: true,
    devtool: 'inline-source-map',
}