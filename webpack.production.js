const merge = require( 'webpack-merge' );
const webpack= require( 'webpack' );
const config = require( './webpack.config' );
const MiniCSSExtractPlugin = require( 'mini-css-extract-plugin' );
const UglifyJSPlugin = require( 'uglifyjs-webpack-plugin' );
const OptimizeCSSAssetsPlugin = require( 'optimize-css-assets-webpack-plugin' );

module.exports = merge( config, {
	output: {
		filename: '[name].js',
		path: `${ __dirname }/block`,
	},
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: [
					MiniCSSExtractPlugin.loader,
					{ loader: 'css-loader', options: { sourceMap: true, importLoaders: 1 } },
					{ loader: 'sass-loader', options: { sourceMap: true } },
				]
			}
		]
	},
	plugins: [
		new MiniCSSExtractPlugin( {
			filename: '[name].css',
		} ),
		new UglifyJSPlugin( {
			cache: true,
			parallel: true,
			sourceMap: true // set to true if you want JS source maps
		} ),
		new OptimizeCSSAssetsPlugin( {} ),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify( 'production' )
		} ),
	]
} );