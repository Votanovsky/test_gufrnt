const path = require('path')

module.exports = {
    entry: {
        index: "./src/js/index.js",
        ribbon: "./src/js/ribbon.js",
        sert: "./src/js/sert.js",
        
    },
    module: {
        rules: [
            {test: /\.(png|jpe?g)$/, use: "file-loader"},
            {test: /\.css$/, use: ["style-loader", "css-loader"]},
            {test: /\.glsl$/, use: "webpack-glsl-loader"},
            {
                test: /\.(woff(2)?|otf|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                  {
                    loader: 'file-loader',
                    options: {
                      name: '[name].[ext]',
                      outputPath: 'fonts/'
                    }
                  }
                ]
              }
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].js'
    },
    mode: "development"
}