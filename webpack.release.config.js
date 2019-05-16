const path = require('path');

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
    mode: 'production',
    output: {
        filename: 'dist/[name].bundle.js',
        chunkFilename: 'dist/[name].bundle.js',
        path: path.resolve(__dirname),
    },
    resolve,
    module: module1,
    plugins: [
    ]
};

module.exports = webConfig;