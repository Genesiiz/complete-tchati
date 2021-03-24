const webpack = require('webpack');
const WebpackModules = require('webpack-modules');
const path = require('path');
const config = require('sapper/config/webpack.js');
const pkg = require('./package.json');
const sveltePreprocess = require('svelte-preprocess');

const mode = process.env.NODE_ENV;
const dev = mode === 'development';

const alias = {
	svelte: path.resolve('node_modules', 'svelte'),
	'@': path.resolve(__dirname, 'src'),
	'@components': path.resolve(__dirname, 'src/components'),
	'@helpers': path.resolve(__dirname, 'src/helpers'),
	'@partials': path.resolve(__dirname, 'src/partials'),
	'@graphql': path.resolve(__dirname, 'src/graphql'),
	'@store': path.resolve(__dirname, 'src/store'),
	'@js': path.resolve(__dirname, 'src/js'),
	'@styles': path.resolve(__dirname, 'src/styles')
};
const extensions = ['.mjs', '.js', '.json', '.svelte', '.html'];
const mainFields = ['svelte', 'module', 'browser', 'main'];

const preprocess = sveltePreprocess({
	sourceMap: dev,
	postcss: {
		plugins: [require('autoprefixer')()]
	}
});

module.exports = {
	client: {
		entry: config.client.entry(),
		output: config.client.output(),
		resolve: { alias, extensions, mainFields },
		module: {
			rules: [
				{
					test: /\.(svelte|html)$/,
					use: {
						loader: 'svelte-loader',
						options: {
							dev,
							hydratable: true,
							hotReload: false, // pending https://github.com/sveltejs/svelte/issues/2377
							preprocess
						}
					}
				}
			]
		},
		mode,
		plugins: [
			// pending https://github.com/sveltejs/svelte/issues/2377
			// dev && new webpack.HotModuleReplacementPlugin(),
			new webpack.DefinePlugin({
				'process.browser': true,
				'process.env.NODE_ENV': JSON.stringify(mode)
			})
		].filter(Boolean),
		devtool: dev && 'inline-source-map'
	},

	server: {
		entry: config.server.entry(),
		output: config.server.output(),
		target: 'node',
		resolve: { alias, extensions, mainFields },
		externals: Object.keys(pkg.dependencies).concat('encoding'),
		module: {
			rules: [
				{
					test: /\.(svelte|html)$/,
					use: {
						loader: 'svelte-loader',
						options: {
							css: false,
							generate: 'ssr',
							dev,
							preprocess
						}
					}
				}
			]
		},
		mode,
		plugins: [
			new WebpackModules()
		],
		performance: {
			hints: false // it doesn't matter if server.js is large
		}
	},

	serviceworker: {
		entry: config.serviceworker.entry(),
		output: config.serviceworker.output(),
		mode
	}
};
