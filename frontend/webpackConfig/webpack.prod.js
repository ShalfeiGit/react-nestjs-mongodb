const { merge } = require('webpack-merge')
const common = require('../webpack.common.js')
const path = require('path')

module.exports = merge(common, {
	mode: process.env.NODE_ENV,
	devtool: 'source-map',
	output: {
		filename: '[name].[contenthash].bundle.js',
		path: path.resolve(__dirname, '../dist'),
		// clean: true,
		publicPath: '/',
	},
})
