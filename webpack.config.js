var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: [
        'webpack-dev-server/client?http://localhost:9000',
        './js/main.js'
    ],

    output: {
        path: path.join(__dirname, "dist"),
        filename: 'bundle.min.js'
    },

    devServer: {
        contentBase: "./",
        compress: true,
        hot: true,
        port: 9000
    },
    module: {
        rules: [
            {
                test: /\.sass$/,
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader", options: {
                        sourceMap: true
                    }
                }, {
                    loader: "sass-loader", options: {
                        sourceMap: true
                    }
                },
                ]
            },
            {
                test: /\.(js|es6)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }
        ],
        loaders: [
            {
                test: /\.(png|jpg|gif)$/,
                loader: "file-loader?name=img/img-[hash:6].[ext]"
            }
        ]
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: './html_template/html_template.html',
            inject: 'body',
        })
    ]
};
