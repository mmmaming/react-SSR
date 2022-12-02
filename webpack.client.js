const path = require('path');

module.exports = {
    mode: 'development',
    entry: './client/index.js',
    output: {
        filename:'index.js',
        path:path.resolve(__dirname,'public')
    },
    devtool: 'inline-source-map',
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
