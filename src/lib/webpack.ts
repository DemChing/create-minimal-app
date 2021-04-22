import { DistPath, SrcPath, WebpackFilename } from '../variables';
import { WriteFile } from './util';

interface IPackageConfig {
    [key: string]: {
        name: string;
        code: string;
    }
}

interface IWebpackOptions {
    css?: boolean;
    scss?: boolean;
    ts?: boolean;
    minify?: boolean;
    watch?: boolean;
    devServer?: boolean | number;
    src?: string;
    dist?: string;
}

const toVar = (name: string) => name.split('-').map(v => v[0].toUpperCase() + v.slice(1)).join('');

const PackageConfig: IPackageConfig = {
    tenser: {
        name: 'terser-webpack-plugin',
        code: `new {{PACKAGE}}({
            terserOptions: {
                parse: {
                    ecma: 8,
                },
                compress: {
                    ecma: 5,
                    warnings: false,
                    comparisons: false,
                    inline: 2,
                },
                mangle: {
                    safari10: true,
                },
                output: {
                    ecma: 5,
                    comments: false,
                    ascii_only: true,
                },
            },
            extractComments: false,
        }),`,
    },
    forkTs: {
        name: 'fork-ts-checker-webpack-plugin',
        code: 'new {{PACKAGE}}(),',
    }
}

export default function CreateWebpackConfigJs(dir: string, {
    css = false,
    scss = false,
    ts = false,
    minify = false,
    watch = false,
    devServer = false,
    src = '',
    dist = '',
}: IWebpackOptions, force: boolean = false) {

    let packages = ['path'],
        plugins = [],
        extensions = ['jsx', 'js'],
        optimization = '';

    const toCode = (name: string) => {
        let code = '';
        if (name in PackageConfig) {
            let config = PackageConfig[name];
            packages.push(config.name);
            config = config || { name: '', code: '' };
            code = config.code.replace(new RegExp(`{{PACKAGE}}`, 'g'), toVar(config.name));
        }
        return code;
    };

    src = src || SrcPath;
    dist = dist || DistPath;

    if (css || scss) extensions.push('css');
    if (scss) extensions.push('scss', 'sass');
    if (ts) {
        extensions.push('tsx', 'ts');
        plugins.push(toCode('forkTs'));
    }

    if (minify) {
        optimization = `optimization: {
            minimize: true,
            minimizer: [
                ${toCode('tenser')}
            ],
            splitChunks: {
                cacheGroups: {
                    defaultVendors: {
                        test: /node_modules/,
                        priority: -10,
                        reuseExistingChunk: true
                    }
                }
            }
        },`;
    }

    let content = `${packages.map(name => `const ${toVar(name)} = require('${name}')`).join('\n')}

module.exports = {
    entry: {
        app: {
            import: '${src}/index.${ts ? 't' : 'j'}sx',
            dependOn: ['vendor'],
        },
        vendor: ['react', 'react-dom'],
    },
    output: {
        path: ${toVar('path')}.resolve(__dirname, '${dist}'),
        filename: '[name].bundle.js',
    },
    ${optimization}
    module: {
        rules: [
            {
                test: /\\.(ts|js)x?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env',
                                '@babel/preset-react',
                                ${ts ? `'@babel/preset-typescript',` : ''}
                            ],
                        },
                    },
                    ${ts ? `{
                        loader: "ts-loader",
                        options: {
                            transpileOnly: true,
                        }
                    },` : ''}
                ]
            },
            ${scss ? `{
                test: /\\.s[ac]ss$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    {
                        loader: "sass-loader",
                        options: {
                            implementation: require("sass"),
                        },
                    },
                ],
            },` : ''}
            ${scss || css ? `{
                test: /\\.css$/i,
                use: [
                    "style-loader",
                    "css-loader",
                ],
            },` : ''}
        ],
    },
    plugins: [
        ${plugins.filter(v => Boolean(v)).join('\n        ')}
    ],
    resolve: {
        extensions: [${extensions.map(ext => `'.${ext}'`).join(', ')}],
    },
    watch: ${watch},
    watchOptions: {
        ignored: /node_modules/,
    },
    ${devServer ? `{
        contentBase: ${toVar('path')}.resolve(__dirname, '${dist}'),
        compress: true,
        port: ${typeof devServer === 'number' ? devServer : 9000},
    }` : ''}
}`.trim();
    return WriteFile(dir, WebpackFilename, content, force)
}