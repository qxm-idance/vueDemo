
var webpack = require('webpack');
var fs = require('fs');
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var vueMultiLoader = require("vue-multi-loader");
var path = require('path');
var devPath = path.join(__dirname + '/dev/js');
var buildPath = path.join(__dirname + '/build/');

var ENV = process.env.npm_lifecycle_event;
var isBuild = ENV === 'build';
var isDev = ENV === 'dev';

module.exports = function cfg () {

    var cfg = {};

    cfg.entry = {
        app: path.join(devPath, 'index.js'),
        style: [
            path.resolve(__dirname, 'dev/style/am', 'am.min.css'),
            path.resolve(__dirname, 'dev/style', 'ui.css'),
            path.resolve(__dirname, 'dev/style', 'main.css'),
            path.resolve(__dirname, 'dev/style', 'animate.css')
        ]
    };

    if (isBuild) {
        cfg.entry.vendor = ['vue', 'vue-resource', 'vue-router', 'hammerjs', 'vue-touch'];
    }

    cfg.output = {
        path: __dirname + '/build',

        // publicPath: isBuild ? '' : 'http://192.168.18.240:7000/',

        filename: isBuild ? 'js/[name].[chunkhash:8].js' : '[name].bundle.js',

        chunkFilename: isBuild ? 'js/[name].[chunkhash:8].js' : '[name].bundle.js'
    };

    if (isBuild) {
        //cfg.devtool = 'source-map';
    } else {
        cfg.devtool = 'eval-source-map';
    }

    cfg.module = {
        preLoaders: [],
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                query: {
                    cacheDirectory: true,
                    presets: ['es2015', 'stage-2']
                },
                exclude: /node_modules/
            },
            {
                test: /\.vue$/,
                loader: 'vue'
            },
            // {
            //     test: /\.css$/,
            //     loaders: ['style', 'css']
            // },
            // {
            //     test: /\.less$/,
            //     loaders: ['style', 'css', 'less']
            // },
            {
                test: /\.(png|jpg)$/,
                loader: 'url',
                query: {
                    limit: 10000,
                    name: path.join(buildPath, 'img/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(html|htm)$/,
                loader: 'raw'
            }
        ]
    };

    cfg.plugins = [
        // new webpack.optimize.CommonsChunkPlugin({
        //   names: ['vendor', 'manifest']
        // }),
        new webpack.DefinePlugin({
           __DEV__: isDev,
           __DEV_IP_PORT__: 7070,
           __DEV_IP_ADDRESS__: '"' + ip()[0] + '"'
        }),
        new webpack.ProvidePlugin({
            Vue: 'Vue',
            vue: 'Vue'
        })
    ];
    if (!isBuild) {
        cfg.plugins.push(
            new HtmlWebpackPlugin({
                template: 'dev/index.html',
                // excludeChunks: ['manifest'],
                inject: 'body',
                // templateContent: function() {
                //   var indexTemplate = fs.readFileSync(path.resolve('./dev/index.html'), 'utf8');
                //   return indexTemplate
                // },
                // minify: {
                //     removeComments: true,
                //     minifyJS: true,
                //     collapseWhitespace: true
                // },
                // chunksSortMode: 'dependency'
            })
        );
        cfg.module.loaders = cfg.module.loaders.concat({
            test: /\.css$/,
            loaders: ['style', 'css']
        },
        {
            test: /\.less$/,
            loaders: ['style', 'css', 'less']
        });
    }
    // cfg.vue = {
    //     loaders: {
    //       css: ExtractTextPlugin.extract("css"),
    //       less: ExtractTextPlugin.extract("css!less")
    //     }
    // };
    if (isBuild) {
        // cfg.vue = {
        //     loaders: cssLoaders({extract: true})
        // };
        cfg.module.loaders = cfg.module.loaders.concat({
            test: /\.css$/,
            loader: ExtractTextPlugin.extract('style', 'css'),
            });

        cfg.plugins.push(
            new HtmlWebpackPlugin({
                excludeChunks: ['manifest'],
                chunksOrder: [
                    'vendor',
                    'app'
                ],
                templateContent: function(templateParams, compilation) {
                    Object.keys(compilation.assets).forEach((key) => {
                        if(/style\..+\.css/.test(key)) {
                            //奇葩
                            compilation.assets[key].children.forEach(key => {
                                key._value = key._value.replace(/translateZ\(0\)/g, 'translate3d(0, 0, 0)');
                            })
                        }
                        if (key.indexOf('manifest.') !== -1) {
                            templateParams.chunkManifest = compilation.assets[key]._value;
                            delete compilation.assets[key];
                        }
                        if(/style\..+\.js/.test(key)) {
                            delete compilation.assets[key];
                        }

                    })
                    Object.keys(templateParams.htmlWebpackPlugin.files.chunks).forEach((key) => {
                        if (/style\..+\.js/.test(templateParams.htmlWebpackPlugin.files.chunks[key].entry)) {
                            delete templateParams.htmlWebpackPlugin.files.chunks[key];
                        }
                    });

                    var indexTemplate = fs.readFileSync(path.resolve('./dev/index.build.html'), 'utf8');
                    var tmpl = require('blueimp-tmpl');
                    return tmpl(indexTemplate, templateParams);
                },
                //   cache: true,
                //   hash: true,
                minify: {
                    removeComments: true,
                    minifyJS: true,
                    collapseWhitespace: true
                }
            }),
            new webpack.NoErrorsPlugin(),
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                },
                output: {
                    comments: false
                }
            }),
              // split vendor js into its own file
            // new webpack.optimize.CommonsChunkPlugin({
            //   name: 'vendor',
            //   minChunks: function (module, count) {
            //     // any required modules inside node_modules are extracted to vendor
            //     return (
            //       module.resource &&
            //       /\.js$/.test(module.resource) &&
            //       module.resource.indexOf(
            //         path.join(__dirname, '../node_modules')
            //       ) === 0
            //     )
            //   }
            // }),
            // new webpack.optimize.CommonsChunkPlugin({
            //   name: 'style',
            //   minChunks: function (module, count) {
            //     // any required modules inside node_modules are extracted to vendor
            //     return (
            //       module.resource &&
            //       /\.less$/.test(module.resource) &&
            //       module.resource.indexOf(
            //         path.join(__dirname, '../node_modules')
            //       ) === 0
            //     )
            //   }
            // }),
            new webpack.optimize.CommonsChunkPlugin({
                name: ['vendor', 'manifest']
            }),
            // new webpack.optimize.CommonsChunkPlugin({
            //     name: ['style', 'manifest']
            // }),
            // extract webpack runtime and module manifest to its own file in order to
            // prevent vendor hash from being updated whenever app bundle is updated
            // new webpack.optimize.CommonsChunkPlugin({
            //   name: 'manifest',
            //   chunks: ['vendor']
            // }),
            // new webpack.optimize.CommonsChunkPlugin({
            //   name: 'manifest',
            //   chunks: ['style']
            // }),
            new webpack.optimize.OccurenceOrderPlugin(),
            new ExtractTextPlugin('css/[name].[contenthash:8].css'),
            new CopyWebpackPlugin([
                {
                    from: __dirname + 'dev'
                }
            ])
        );
    }

    cfg.devServer = {
        contentBase: 'dev',
        stats: 'minimal'
    };

    return cfg;
}();

function cssLoaders (options) {
  options = options || {}
  // generate loader string to be used with extract text plugin
  function generateLoaders (loaders) {
    var sourceLoader = loaders.map(function (loader) {
      var extraParamChar
      if (/\?/.test(loader)) {
        loader = loader.replace(/\?/, '-loader?')
        extraParamChar = '&'
      } else {
        loader = loader + '-loader'
        extraParamChar = '?'
      }
      return loader + (options.sourceMap ? extraParamChar + 'sourceMap' : '')
    }).join('!')

    if (options.extract) {
      return ExtractTextPlugin.extract('vue-style-loader', sourceLoader)
    } else {
      return ['vue-style-loader', sourceLoader].join('!')
    }
  }

  // http://vuejs.github.io/vue-loader/configurations/extract-css.html
  return {
    css: generateLoaders(['css']),
    postcss: generateLoaders(['css']),
    less: generateLoaders(['css', 'less']),
    // sass: generateLoaders(['css', 'sass?indentedSyntax']),
    // scss: generateLoaders(['css', 'sass']),
    // stylus: generateLoaders(['css', 'stylus']),
    // styl: generateLoaders(['css', 'stylus'])
  }
};

function ip() {
    var addresses = [],
        os = require('os'),
        interfaces = os.networkInterfaces();

    for (var ifaces in interfaces) {
        var iface = interfaces[ifaces].filter(function(detail) {
            return detail.family === 'IPv4' && detail.internal === false;
        });
        addresses = addresses.concat(iface);
    }

    return addresses.map(function(detail) {
        return detail.address;
    })
}
