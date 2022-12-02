const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    target:'node',
    mode:'development',
    entry:'./server/index.js',
    output: {
        filename:'index.js',
        path:path.resolve(__dirname,'bundle')
    },
    devtool: 'inline-source-map',
    externals: [nodeExternals()],
    module: {
        rules: [{
            test:   /.js?$/,
            loader:'babel-loader',
            exclude: /node_modules/,
            options: {
                presets: ['@babel/preset-react',['@babel/preset-env', {
                    targets: {
                        chrome: '100'
                    }
                }]]
            }
        }]
    }
}
