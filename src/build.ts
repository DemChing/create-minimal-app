import CreatePackageJson from './lib/package-json';
import { PathResolve, SelfPackageJson, ShortName } from './lib/util';

interface IObject { [key: string]: string };

const PackageJson = SelfPackageJson();

const BaseFilename = 'index';

const SubPrograms = ['webpack'];

const buildConfig = (name: string = ''): IObject => {
    let suffix = name ? `-${name}` : '',
        cmd = PackageJson.name + suffix,
        scmd = ShortName(cmd),
        src = `dist/${name || BaseFilename}.js`;

    return {
        [cmd]: src,
        [scmd]: src,
    };
}

let bin = buildConfig(),
    scripts: IObject = {
        build: 'tsc && ts-node src/build.ts',
    };

SubPrograms.map(name => bin = {
    ...bin,
    ...buildConfig(name),
})

for (let key in bin) {
    if (key.length < PackageJson.name.length) {
        scripts[key] = 'ts-node ' + bin[key].replace('dist', 'src').replace('js', 'ts')
    }
}

PackageJson.bin = bin;
PackageJson.scripts = scripts;

CreatePackageJson(PathResolve(), PackageJson, true);