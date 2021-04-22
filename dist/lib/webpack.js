"use strict";
exports.__esModule = true;
var variables_1 = require("../variables");
var util_1 = require("./util");
var toVar = function (name) { return name.split('-').map(function (v) { return v[0].toUpperCase() + v.slice(1); }).join(''); };
var PackageConfig = {
    tenser: {
        name: 'terser-webpack-plugin',
        code: "new {{PACKAGE}}({\n            terserOptions: {\n                parse: {\n                    ecma: 8,\n                },\n                compress: {\n                    ecma: 5,\n                    warnings: false,\n                    comparisons: false,\n                    inline: 2,\n                },\n                mangle: {\n                    safari10: true,\n                },\n                output: {\n                    ecma: 5,\n                    comments: false,\n                    ascii_only: true,\n                },\n            },\n            extractComments: false,\n        }),"
    },
    forkTs: {
        name: 'fork-ts-checker-webpack-plugin',
        code: 'new {{PACKAGE}}(),'
    }
};
function CreateWebpackConfigJs(dir, _a, force) {
    var _b = _a.css, css = _b === void 0 ? false : _b, _c = _a.scss, scss = _c === void 0 ? false : _c, _d = _a.ts, ts = _d === void 0 ? false : _d, _e = _a.minify, minify = _e === void 0 ? false : _e, _f = _a.watch, watch = _f === void 0 ? false : _f, _g = _a.devServer, devServer = _g === void 0 ? false : _g, _h = _a.src, src = _h === void 0 ? '' : _h, _j = _a.dist, dist = _j === void 0 ? '' : _j;
    if (force === void 0) { force = false; }
    var packages = ['path'], plugins = [], extensions = ['jsx', 'js'], optimization = '';
    var toCode = function (name) {
        var code = '';
        if (name in PackageConfig) {
            var config = PackageConfig[name];
            packages.push(config.name);
            config = config || { name: '', code: '' };
            code = config.code.replace(new RegExp("{{PACKAGE}}", 'g'), toVar(config.name));
        }
        return code;
    };
    src = src || variables_1.SrcPath;
    dist = dist || variables_1.DistPath;
    if (css || scss)
        extensions.push('css');
    if (scss)
        extensions.push('scss', 'sass');
    if (ts) {
        extensions.push('tsx', 'ts');
        plugins.push(toCode('forkTs'));
    }
    if (minify) {
        optimization = "optimization: {\n            minimize: true,\n            minimizer: [\n                " + toCode('tenser') + "\n            ],\n            splitChunks: {\n                cacheGroups: {\n                    defaultVendors: {\n                        test: /node_modules/,\n                        priority: -10,\n                        reuseExistingChunk: true\n                    }\n                }\n            }\n        },";
    }
    var content = (packages.map(function (name) { return "const " + toVar(name) + " = require('" + name + "')"; }).join('\n') + "\n\nmodule.exports = {\n    entry: {\n        app: {\n            import: '" + src + "/index." + (ts ? 't' : 'j') + "sx',\n            dependOn: ['vendor'],\n        },\n        vendor: ['react', 'react-dom'],\n    },\n    output: {\n        path: " + toVar('path') + ".resolve(__dirname, '" + dist + "'),\n        filename: '[name].bundle.js',\n    },\n    " + optimization + "\n    module: {\n        rules: [\n            {\n                test: /\\.(ts|js)x?$/,\n                exclude: /node_modules/,\n                use: [\n                    {\n                        loader: 'babel-loader',\n                        options: {\n                            presets: [\n                                '@babel/preset-env',\n                                '@babel/preset-react',\n                                " + (ts ? "'@babel/preset-typescript'," : '') + "\n                            ],\n                        },\n                    },\n                    " + (ts ? "{\n                        loader: \"ts-loader\",\n                        options: {\n                            transpileOnly: true,\n                        }\n                    }," : '') + "\n                ]\n            },\n            " + (scss ? "{\n                test: /\\.s[ac]ss$/i,\n                use: [\n                    \"style-loader\",\n                    \"css-loader\",\n                    {\n                        loader: \"sass-loader\",\n                        options: {\n                            implementation: require(\"sass\"),\n                        },\n                    },\n                ],\n            }," : '') + "\n            " + (scss || css ? "{\n                test: /\\.css$/i,\n                use: [\n                    \"style-loader\",\n                    \"css-loader\",\n                ],\n            }," : '') + "\n        ],\n    },\n    plugins: [\n        " + plugins.filter(function (v) { return Boolean(v); }).join('\n        ') + "\n    ],\n    resolve: {\n        extensions: [" + extensions.map(function (ext) { return "'." + ext + "'"; }).join(', ') + "],\n    },\n    watch: " + watch + ",\n    watchOptions: {\n        ignored: /node_modules/,\n    },\n    " + (devServer ? "{\n        contentBase: " + toVar('path') + ".resolve(__dirname, '" + dist + "'),\n        compress: true,\n        port: " + (typeof devServer === 'number' ? devServer : 9000) + ",\n    }" : '') + "\n}").trim();
    return util_1.WriteFile(dir, variables_1.WebpackFilename, content, force);
}
exports["default"] = CreateWebpackConfigJs;
