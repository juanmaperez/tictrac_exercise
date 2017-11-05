const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const include = path.resolve(__dirname, 'src');

module.exports = {
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
    },
    entry: {
        main: './src/js/main.js',
        index: './src/styles/index.scss'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                include,
                use: [
                    {
                        loader: 'babel-loader'
                    }
                ]
            },
            {
                test: /\.scss$/i,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader',
                        'sass-loader'
                    ]
                })
            }
        ]
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    plugins: [
        new ExtractTextPlugin('styles.css')
    ]
};
