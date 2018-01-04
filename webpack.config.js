module.exports = {
    entry: './src/main.js',
    output: {
        filename: 'public/bundle.js'
    },
    module: {
        rules: [
            {
                test: /.js$/,
                loader: 'babel-loader',
                options: {
                    presets: ['es2015', 'react']
                }
            }
        ]
    }
}