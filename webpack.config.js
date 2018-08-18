module.exports = {
	entry: {
		editor: `${ __dirname }/src/index.js`,
		frontend: `${ __dirname }/src/frontend/index.js`,
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				options: {
					presets: [ 'env', 'react' ],
					plugins: [
						'babel-plugin-transform-class-properties',
						'babel-plugin-transform-object-rest-spread'
					]
				}
			},
			{
				test: /\.scss$/,
				use: [
					{ loader: 'style-loader' },
					{ loader: 'css-loader' },
					{ loader: 'sass-loader' }
				]
			}
		]
	},
	resolve: {
		extensions: [ '.jsx', '.js' ],
		alias: {
			'@example': `${ __dirname }/src`,
			'@wordpress': `${ __dirname }/src/wordpress`
		}
	},
	output: {
		filename: '[name].js',
		path: `${ __dirname }/build`,
	}
};