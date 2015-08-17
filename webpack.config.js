var path = require('path')

module.exports = {
    entry: "./public/js/main.js",
    output: {
        path: path.join(__dirname, 'public/js/'),
        filename: "app.js",
        minimize: "true"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            { test: /\.(glsl|frag|vert)$/, loader: 'raw', exclude: /node_modules/ },
            { test: /\.(glsl|frag|vert)$/, loader: 'glslify', exclude: /node_modules/ }
        ]
    }
};
