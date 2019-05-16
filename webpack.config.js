const path = require('path');
var ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const resolve = {
    extensions: ['.ts', '.tsx', '.js', '.json']
};

const module1 = {
    rules: [{
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        options: {
            // disable type checker - we will use it in fork plugin
            transpileOnly: true,
            experimentalWatchApi: true
        }
    }]
}

const webConfig = {
    entry: './src/index.tsx',
    mode: 'development',
    devtool: "sourcemap",
    target: "electron-renderer",
    output: {
        filename: 'dist/[name].bundle.js',
        chunkFilename: 'dist/[name].chunk.js',
        path: path.resolve(__dirname),

    },
    resolve,
    module: module1,
    devServer: {
        // contentBase: path.join(__dirname, 'dist'),
        // index: '../index.html',
        // compress: true,
        port: 9001,
        open: true
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin()
    ]
};

module.exports = webConfig;