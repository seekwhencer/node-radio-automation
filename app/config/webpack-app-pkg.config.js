const
    fs = require('fs-extra'),
    path = require('path'),
    webpack = require('webpack'),
    babelLoader = {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
            loader: "babel-loader",
            options: {
                presets: ["@babel/preset-env"]
            }
        }
    };

webpack_rules = [].push(babelLoader);

module.exports = {
    target: "node",
    mode: 'production',
    entry: './index.js',
    output: {
        filename: 'dist/app.js',
        path: path.resolve(process.env.PWD),
        publicPath: '/',
    },
    node: {
        __dirname: false,
        __filename: false
    },
    plugins: [
        new webpack.DefinePlugin({ "global.GENTLY": false }), // hack for formidable
        {
            apply: (compiler) => {
                compiler.hooks.afterEmit.tap('Complete', (compilation) => {
                    console.log('>>> BUNDLING COMPLETE');
                });
            }
        }
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"]
                    }
                }
            }
        ]
    }
};
