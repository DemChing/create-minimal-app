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

const generate = ({
    css = false,
    scss = false,
    ts = false,
    minify = false,
    watch = false,
    devServer = false
}: IWebpackOptions) => {
    let packages = ['path'],
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

    if (css || scss) extensions.push('css');
    if (scss) extensions.push('scss', 'sass');
    if (ts) extensions.push('tsx', 'ts');

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

    return `${packages.map(name => `const ${toVar(name)} = require('${name}')`).join('\n')}

module.exports = {
    entry: {
        app: {
            import: '${SrcPath}/index.${ts ? 't' : 'j'}sx',
            dependOn: ['vendor'],
        },
        vendor: ['react', 'react-dom'],
    },
    output: {
        path: ${toVar('path')}.resolve(__dirname, '${DistPath}'),
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
        ${ts ? toCode('forkTs') : ''}
    ],
    resolve: {
        extensions: [${extensions.map(ext => `'.${ext}'`).join()}],
    },
    watch: ${watch},
    watchOptions: {
        ignored: /node_modules/,
    },
    ${devServer ? `{
        contentBase: ${toVar('path')}.resolve(__dirname, '${DistPath}'),
        compress: true,
        port: ${typeof devServer === 'number' ? devServer : 9000},
    }` : ''}
}`.trim()
}

export default function CreateWebpackConfigJs(dir: string, options: IWebpackOptions, force: boolean = false) {
    return WriteFile(dir, WebpackFilename, generate({
        css: options.css,
        scss: options.scss,
        ts: options.ts,
        minify: options.minify,
        watch: options.watch,
        devServer: options.devServer,
    }), force)
}