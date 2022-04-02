import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import SizePlugin from "size-plugin";
import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin";
import { fileURLToPath } from "url";
import {
	Configuration,
	WebpackPluginInstance
} from "webpack";
import { type Configuration as DevServerConfig } from "webpack-dev-server";
import WebpackMessages from "webpack-messages";
import RemoveEmptyScriptsPlugin from "webpack-remove-empty-scripts";

const root = path.dirname(fileURLToPath(import.meta.url));
const isDebug = process.env.NODE_ENV !== "production";

let config: Configuration & { devServer?: DevServerConfig } = {
	stats: "errors-warnings",
	mode: isDebug ? "development" : "production",
	devtool: isDebug ? "inline-source-map" : "source-map",

	entry: {
		app: `${root}/src/index.tsx`
	},

	module: {
		rules: [
			{
				test: /\.[cm]?tsx?$/,
				exclude: /node_modules/,
				use: [
					{
						loader: "ts-loader",
						options: {
							context: root,
							transpileOnly: isDebug
						}
					}
				]
			},

			{
				test: /\.json$/,
				exclude: /node_modules/,
				loader: "json5-loader",
				type: "javascript/auto",
				options: {
					esModule: false
				}
			},

			{
				test: /./,
				exclude: /\.([cm]?[jt]sx?|json|scss|html|svg)$|node_modules/,
				type: "asset/resource"
			}
		]
	},

	plugins: [
		isDebug
			? new WebpackMessages({
				logger: (string) => console.log(string)
			})
			: null,

		isDebug ? null : new RemoveEmptyScriptsPlugin(),

		isDebug ? null : new SizePlugin({}),

		new HtmlWebpackPlugin({
			template: `${root}/src/template.html`,
			chunks: "all"
		})
	].filter(Boolean) as WebpackPluginInstance[],

	resolve: {
		extensions: [".js", ".jsx", ".ts", ".tsx", ".json", ".scss", ".css"],

		plugins: [
			new TsconfigPathsPlugin({
				configFile: path.resolve(root, "tsconfig.json")
			})
		],

		modules: [
			`${root}/node_modules`,
			`${root}/node_modules/.pnpm/node_modules`
		],

		alias: {
			react: "preact/compat",
			"react-dom": "preact/compat"
		},

		fallback: {
			path: "path-browserify"
		}
	},

	experiments: {
		topLevelAwait: true
	},

	optimization: {
		moduleIds: "natural"
	},

	output: {
		filename: `assets/[name]${isDebug ? "" : ".[contenthash:5]"}.js`,
		chunkFilename: `assets/[name].bundle${isDebug ? "" : ".[chunkhash:5]"}.js`,
		assetModuleFilename: `assets/[hash][ext]`,
		path: path.resolve(root, "dist/"),
		publicPath: "/"
	}
};
export default config;
