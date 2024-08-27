import path from "path";
import type { ModuleOptions } from "webpack";

export const rules: Required<ModuleOptions>["rules"] = 
[
    // Add support for native node modules
    {
        // We're specifying native_modules in the test because the asset relocator loader generates a
        // "fake" .node file which is really a cjs file.
        test: /native_modules[/\\].+\.node$/,
        use: "node-loader",
    },
    {
        test: /[/\\]node_modules[/\\].+\.(m?js|node)$/,
        parser: { amd: false },
        use: 
        {
            loader: "@vercel/webpack-asset-relocator-loader",
            options: 
            {
                outputAssetBase: "native_modules",
            },
        },
    },
    {
        test: /\.tsx?$/,
        exclude: /(node_modules|\.webpack)/,
        use: {
            loader: "ts-loader",
            options: 
            {
                transpileOnly: true,
            },
        },
    },

    {
        test: /\.(png|jpe?g|gif|svg|ico|woff|woff2|ttf|otf|eot|mp4|webm|mp3|wav|pdf|txt)$/,
        type: "asset/resource",
        generator:
        {
            filename: "assets/[hash][ext][query]",
        }
    },

    {
        test: /\.(htm|html)$/,
        use: 
        [{
            loader: "html-loader",
        }],
    },
];


export const alias =
{
    "source": path.resolve(__dirname, "source"),
    "public": path.resolve(__dirname, "public")
}