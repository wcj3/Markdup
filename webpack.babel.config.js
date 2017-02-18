module.exports = {
    entry: ['babel-polyfill', "./src"],
    output: {
        path: "lib",
        filename: "markdup.js",
        library: "Markdup",
        libraryTarget: "var"
    },
    module: {
        rules: [{
            test: /\.js$/,
            use: "babel-loader"
        }, {
            test: /\.css$/,
            use: ["style-loader", "css-loader"]
        }]
    }
}
