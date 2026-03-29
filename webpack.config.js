const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv');

dotenv.config();

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './src/scripts/main.ts',
    output: {
      filename: isProduction ? 'js/[name].[contenthash].js' : 'js/[name].js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
      publicPath: '/'
    },
    resolve: {
      extensions: ['.ts', '.js'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@styles': path.resolve(__dirname, 'src/styles'),
        '@scripts': path.resolve(__dirname, 'src/scripts'),
        '@assets': path.resolve(__dirname, 'src/assets')
      }
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/images/[hash][ext][query]'
          }
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/fonts/[hash][ext][query]'
          }
        },
        {
          test: /\.json$/,
          type: 'json'
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        minify: isProduction ? {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true
        } : false,
        meta: {
          viewport: 'width=device-width, initial-scale=1.0',
          description: 'Data Analyst portfolio of Vasanthaprakash E - SQL, Power BI, Python expert',
          keywords: 'Data Analyst, Portfolio, SQL, Power BI, Python'
        }
      }),
      new webpack.DefinePlugin({
        'process.env.GOOGLE_SCRIPT_URL': JSON.stringify(process.env.GOOGLE_SCRIPT_URL || ''),
        'process.env.ENCRYPTION_KEY': JSON.stringify(process.env.ENCRYPTION_KEY || ''),
        'process.env.API_BASE_URL': JSON.stringify(process.env.API_BASE_URL || '')
      })
    ],
    optimization: {
      minimize: isProduction,
      minimizer: [new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: isProduction,
            drop_debugger: isProduction,
            pure_funcs: isProduction ? ['console.log', 'console.debug'] : []
          },
          mangle: true,
          output: {
            comments: false
          }
        },
        extractComments: false
      })],
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
          },
          styles: {
            name: 'styles',
            test: /\.css$/,
            chunks: 'all',
            enforce: true
          }
        }
      },
      runtimeChunk: 'single'
    },
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist')
      },
      compress: true,
      port: 3000,
      hot: true,
      open: true,
      historyApiFallback: true,
      client: {
        overlay: true,
        progress: true
      }
    },
    devtool: isProduction ? false : 'source-map',
    performance: {
      hints: isProduction ? 'warning' : false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    }
  };
};