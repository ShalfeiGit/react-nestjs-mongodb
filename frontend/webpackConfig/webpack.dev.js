const { merge } = require('webpack-merge')
const common = require('../webpack.common.js')
const path = require('path')

module.exports = merge(common, {

	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, '../dist'),
		clean: true,
		publicPath: '/',
	},
	devtool: 'inline-source-map',
	devServer: {
		static: '../dist',
		hot: true,
		historyApiFallback: true, 
	},
})
