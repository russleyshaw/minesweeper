const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerPlugin = require("fork-ts-checker-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

const path = require("path");

module.exports = (_, args) => {
    const mode = args.mode || "development";
    const isDevMode = mode === "development";

    const plugins = [
        new HtmlWebpackPlugin({ template: "./src/index.html" }),
        new ForkTsCheckerPlugin(),
        new MiniCssExtractPlugin(),
        isDevMode && new webpack.HotModuleReplacementPlugin(),
        isDevMode && new ReactRefreshWebpackPlugin(),
    ].filter(Boolean);

    return {
        mode,
        entry: {
            index: "./src/index.tsx",
        },
        optimization: {
            splitChunks: {
                chunks: "all",
            },
        },
        module: {
            rules: [
                {
                    test: /\.(j|t)sx?$/,
                    exclude: /node_modules/,
                    use: {
                        loader: require.resolve("babel-loader"),
                        options: {
                            cacheDirectory: true,
                            presets: [
                                [
                                    "@babel/preset-env",
                                    { useBuiltIns: "entry", corejs: 3, targets: { node: 14 } },
                                ],
                                "@babel/preset-typescript",
                                "@babel/preset-react",
                            ],
                            plugins: [
                                "babel-plugin-styled-components",
                                "@babel/plugin-transform-runtime",
                                "@babel/plugin-proposal-nullish-coalescing-operator",
                                "@babel/plugin-proposal-optional-chaining",
                                isDevMode && require.resolve("react-refresh/babel"),
                            ].filter(Boolean),
                        },
                    },
                },
                {
                    test: /\.(png|svg|jpg|jpeg|gif)$/i,
                    type: "asset/resource",
                },
                {
                    test: /\.css$/i,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                esModule: true,
                            },
                        },
                        "css-loader",
                    ],
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                esModule: true,
                            },
                        },
                        "css-loader",
                        "sass-loader",
                    ],
                },
            ],
        },
        devtool: isDevMode ? "eval" : undefined,
        resolve: {
            extensions: [".tsx", ".ts", ".js"],
        },
        output: {
            filename: "[name].bundle.js",
            chunkFilename: "[name].bundle.js",
            path: path.resolve(__dirname, "dist"),
        },
        watchOptions: {
            ignored: /node_modules/,
        },
        plugins,
    };
};
