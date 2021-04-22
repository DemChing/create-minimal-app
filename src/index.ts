#!/usr/bin/env node

import { OptionValues, Command } from 'commander';
import { CreateDir, TPackageJSON, ValidateAppName, ProgramInfo } from './lib/util';
import GitInit from './lib/git-init';
import GitRemoteAdd from './lib/git-remote';
import CreatePackageJson from './lib/package-json';
import CreateWebpackConfigJs from './lib/webpack';
import InstallPackages from './lib/package-install';
import { Browserslist } from './variables';
import CloneStaticFiles from './lib/clone';

interface IOptions extends OptionValues {
    yarn?: boolean;
    force?: boolean;
    cwd?: boolean;

    // package.json
    author?: string[];
    email?: string;
    url?: string;
    ver?: TPackageJSON['version'];
    description?: string[];
    keywords?: TPackageJSON['keywords'];
    browserslist?: string[];
    repository?: string;

    // Git
    git?: boolean | string;

    // packages
    css?: boolean;
    scss?: boolean;
    ts?: boolean;
    minify?: boolean;
    typing?: boolean;

    // webpack
    watch?: boolean;
    devServer?: boolean | number;
    src?: string;
    dist?: string;

    clone?: boolean;
    install?: boolean;
}

process.on('unhandledRejection', err => {
    process.stdout.write('\n\n\n');
    console.error(err)
});

const program = new Command();
const {
    cmd: PackageName,
    scmd: PackageAlias,
    v: PackageVersion,
    info: PackageHelpText,
    done: PackageDone,
} = ProgramInfo();

program
    .name(PackageName)
    .alias(PackageAlias)
    .version(PackageVersion)
    .addHelpText('before', PackageHelpText)
    .arguments('<app-name>')
    .option('--cwd', 'creact app in current working directory')
    .option('--force', 'force processing while warning exists')
    .option('--yarn', 'use Yarn to install packages')
    .option('--author <author...>', 'name of package author')
    .option('--email <email>', 'email of package author')
    .option('--url <url>', 'url of package author')
    .option('--ver <version>', 'package version')
    .option('--desc, --description <description...>', 'package description')
    .option('--kw, --keywords <keywords...>', 'package keywords')
    .option('--bl, --browserslist <browserslist...>', 'package browserslist')
    .option('--repo, --repository <repository>', 'package repository')
    .option('--git [git-repo-url]', 'create Git repository')
    .option('--css', 'include CSS related plugin for Webpack')
    .option('--sass, --scss', 'include SASS/SCSS related plugin for Webpack')
    .option('--ts', 'include Typescript related plugin for Webpack')
    .option('--minify', 'include code minifier plugin for Webpack')
    .option('--watch', 'Webpack watch changes')
    .option('--dev-server [port]', 'port of webpack-dev-server')
    .option('--src <src>', 'entry directory for Webpack')
    .option('--dist <dist>', 'output directory for Webpack')
    .option('--typing', 'install typing packages')
    .option('--no-install', 'do not install packages')
    .option('--no-clone', 'do not clone static files')
    .action(async (appName: string, options: IOptions) => {
        console.log(`${PackageHelpText}\n`);
        appName = appName || '';
        appName = ValidateAppName(appName);

        let packageJSON: TPackageJSON = {
            name: appName,
            version: options.version || '1.0.0',
            browserslist: options.browserslist || Browserslist,
            scripts: {
                'build': 'webpack --mode production',
                'test': 'webpack --mode development'
            },
        },
            author: string[] = [];

        if (options.repository || options.git) {
            let r = typeof options.repository === 'string' ?
                options.repository :
                typeof options.git === 'string' ?
                    options.git :
                    '';
            if (r) {
                let m = r.match(/(github|gitlab|bitbucket)[^:]*:(.+)\/(.+)/) ||
                    r.match(/https?.+(github|gitlab|bitbucket).+\/(.+)\/(.+)/);
                if (m) {
                    let repo = `:${m[2]}/${m[3]}`;
                    options.repository = `${m[1]}${repo}`;
                    if (options.git) options.git = `git@${m[1]}.${m[1] == 'bitbucket' ? 'org' : 'com'}${repo}`;
                }
            }
        }

        if (options.author && options.author.length > 0) author.push(options.author.join(' '));
        if (options.email) author.push(`<${options.email}>`);
        if (options.url) author.push(`(${options.url})`);
        if (author.length > 0) {
            packageJSON.author = author.join(' ');
        }

        if (options.description && options.description.length > 0) packageJSON.description = options.description.join(' ');
        if (options.keywords) packageJSON.keywords = options.keywords;
        if (options.repository) packageJSON.repository = options.repository;

        let cwd = options.cwd ? '.' : appName;
        if (!options.cwd) await CreateDir('application', cwd, options.force);
        if (options.git) {
            await GitInit(cwd, options.force);
            if (typeof options.git === 'string') await GitRemoteAdd(cwd, options.git);
        }

        await CreateWebpackConfigJs(cwd, {
            css: options.css,
            scss: options.scss,
            ts: options.ts,
            minify: options.minify,
            watch: options.watch,
            devServer: options.devServer,
            src: options.src,
            dist: options.dist,
        }, options.force);

        await CreatePackageJson(cwd, packageJSON, options.force);

        if (options.clone) {
            await CloneStaticFiles(cwd, {
                ts: options.ts,
                src: options.src,
                dist: options.dist,
            }, options.force);
        }

        if (options.install) {
            await InstallPackages(cwd, {
                css: options.css,
                scss: options.scss,
                ts: options.ts,
                typing: options.typing,
                minify: options.minify,
                devServer: options.devServer,
                yarn: options.yarn,
            }, options.force);
        }

        console.log(PackageDone());
    });

program.parse();