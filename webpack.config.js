const webpack = require('webpack');
const path = require('path');
const package = require('./package.json');

module.exports = {
	mode: 'none',
	entry: {},
	output: {
			path: path.join(__dirname, 'dist'),
			filename: '[name].js'
	},
	optimization: { minimize: false },
	module: {
			rules: [
					{
							test: /\.tsx?$/,
							use: 'ts-loader',
							exclude: /node_modules/
					}
			]
	},
	resolve: {
			extensions: ['.ts', '.tsx', '.js']
	},
	plugins: [
		new webpack.BannerPlugin({
			raw: true,
			entryOnly: true,
			banner: `// ==UserScript==
// @name         Lobster Keys
// @description  ${package.description}
// @namespace    https://rodaine.com
// @source       ${package.repository.url}
// @version      ${package.version}
// @author       ${package.author}
// @match        https://lobste.rs/*
// @grant        none
// @noframes
// ==/UserScript==
`,
		}),
	]
};

module.exports.entry[package.name.replace('@rodaine/', '')] = path.join(__dirname, 'src/lobster-keys.ts');
