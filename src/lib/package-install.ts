import { ReadPackageJson } from './package-json';
import { IProgressResponse, Progress, RunCMD, SuccessMessage } from './util';

const Packages = {
    css: [
        'style-loader',
        'css-loader',
    ],
    scss: [
        'sass',
        'sass-loader',
    ],
    ts: [
        'ts-loader',
        'typescript',
        'fork-ts-checker-webpack-plugin',
    ],
    minify: [
        'terser-webpack-plugin',
    ],
    devServer: [
        'webpack-dev-server'
    ],
    typing: [
        'react',
        'react-dom',
    ],
};

const Dependencies = [
    'react',
    'react-dom',
];
const DevDependencies = [
    '@babel/core',
    '@babel/preset-env',
    '@babel/preset-react',
    'babel-loader',
    'webpack',
    'webpack-cli',
];

const IgnoredMessage = (arr: string[], isDev: boolean = false) => {
    return `Ignored ${SuccessMessage(arr.length.toString())} ${isDev ? 'development ' : ''}Packages: ${arr.map(v => SuccessMessage(v)).join(', ')}`;
}

interface IPackageOptions {
    css?: boolean;
    scss?: boolean;
    ts?: boolean;
    typing?: boolean;
    minify?: boolean;
    devServer?: boolean | number;
    yarn?: boolean;
}

export default function InstallPackages(dir: string, {
    css = false,
    scss = false,
    ts = false,
    typing = false,
    minify = false,
    yarn = false,
    devServer = false,
}: IPackageOptions, force: boolean = false) {
    let dep = Dependencies,
        dev = DevDependencies;
    if (scss || css) dev = dev.concat(Packages.css);
    if (scss) dev = dev.concat(Packages.scss);
    if (ts) dev = dev.concat(Packages.ts);
    if (devServer) dev = dev.concat(Packages.devServer);
    if (typing || ts) {
        let typings = Packages.typing
            .filter(v => dep.indexOf(v) != -1 || dev.indexOf(v) != -1)
            .map(v => `@types/${v}`);
        dev = dev.concat(typings);
    }
    if (minify) dev = dev.concat(Packages.minify)
    return Progress(
        `Install Packages`,
        () => new Promise(async resolve => {
            let json = ReadPackageJson(dir),
                ignore: string[] = [],
                result: IProgressResponse = {
                    success: true,
                    message: [],
                },
                skips: boolean[] = [];
            if (!force && json.dependencies) ignore = ignore.concat(Object.keys(json.dependencies));
            if (!force && json.devDependencies) ignore = ignore.concat(Object.keys(json.devDependencies));

            const Install = (_dep: string[], _yarn: boolean = false, isDev: boolean = false) => {
                let cmd = _yarn ? 'yarn' : 'npm',
                    ins = 'add',
                    flag = isDev ? '-D' : '',
                    install = _dep.filter(v => ignore.indexOf(v) == -1);

                const cb = (res: IProgressResponse): Promise<IProgressResponse> => {
                    const checkIgnored = (_res: IProgressResponse) => {
                        if (install.length != _dep.length) {
                            _res.message.push(IgnoredMessage(_dep.filter(v => ignore.indexOf(v) != -1), isDev));
                        }
                    }
                    if (!res.success && _yarn && force) {
                        return Install(_dep, false, isDev)
                            .then(_res => {
                                checkIgnored(_res);
                                return _res;
                            });
                    } else {
                        checkIgnored(res);
                        return Promise.resolve(res);
                    }
                }

                let promise: Promise<IProgressResponse>;
                if (install.length > 0) {
                    promise = RunCMD(
                        `Install ${install.length} ${isDev ? 'development ' : ''}Packages`,
                        cmd,
                        [ins, flag, ...install],
                        {
                            cwd: dir,
                        }
                    )
                } else {
                    promise = Promise.resolve({
                        success: true,
                        message: [],
                        skip: true,
                    })
                }
                return promise.then(cb).catch(cb)
            }

            const cb = (res: IProgressResponse) => {
                result.success = result.success && res.success;
                result.message.push(...res.message);
                skips.push(Boolean(res.skip));
            }

            if (dep.length || dev.length) {
                if (dep.length) cb(await Install(dep, yarn));
                if (dev.length) cb(await Install(dev, yarn, true));

                if (skips.reduce((p, c) => p && c, true)) result.skip = true;
            } else {
                result.skip = true;
                if (dep.length) result.message.push(IgnoredMessage(dep));
                if (dev.length) result.message.push(IgnoredMessage(dev, true));
            }

            resolve(result);
        })
    )
}