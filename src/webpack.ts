#!/usr/bin/env node

import { OptionValues, Command } from 'commander';
import InstallPackages from './lib/package-install';
import { CreateDir, ProgramInfo, ValidateAppName } from './lib/util';
import CreateWebpackConfigJs from './lib/webpack';

interface IOptions extends OptionValues {
    yarn?: boolean;
    force?: boolean;
    cwd?: boolean;

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
    done: PackageDone
} = ProgramInfo('webpack');

program
    .name(PackageName)
    .alias(PackageAlias)
    .version(PackageVersion)
    .addHelpText('before', PackageHelpText)
    .arguments('[app-name]')
    .option('--cwd', 'creact app in current working directory')
    .option('--force', 'force processing while warning exists')
    .option('--yarn', 'use Yarn to install packages')
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
    .action(async (appName: string, options: IOptions) => {
        console.log(`${PackageHelpText}\n`);

        appName = appName || '';
        if (!options.cwd) appName = ValidateAppName(appName, true);
        let cwd = options.cwd ? '.' : appName;

        if (!options.cwd) await CreateDir('application', cwd, options.force);

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
    })

program.parse();