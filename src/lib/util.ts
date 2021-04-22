import chalk from 'chalk';
import Path from 'path';
import readline from 'readline';
import { JSONSchemaForNPMPackageJsonFiles } from '@schemastore/package';
import { copyFileSync, mkdirSync, statSync, writeFileSync } from 'fs';
import { spawn, SpawnOptionsWithoutStdio } from "child_process";
import { FilesPath } from '../variables';
import { ReadPackageJson } from './package-json';

export type TPackageJSON = JSONSchemaForNPMPackageJsonFiles;

export interface IProgressResponse {
    success: boolean;
    message: string[];
    count?: number;
    skip?: boolean;
}

let ExistCMD: {
    [key: string]: boolean
} = {
    npm: true,
},
    stack: number[] = [],
    prevStack: number = 0;

const RemoveColor = (msg: string) => msg.replace(/\x1B[[(?);]{0,2}(;?\d)*./g, '')

const ReplaceMessage = (msg: string, ...args: string[]) => {
    for (let i = 0; i < args.length; i++) {
        msg = msg.replace(`{${i}}`, args[i]);
    }
    return msg;
}

const ProcessMessage = (msgType: 'Success' | 'Warning' | 'Error', msg: string = '', ...args: string[]) => {
    let color: chalk.Chalk = msgType === 'Error' ? chalk.red : msgType === 'Warning' ? chalk.yellow : chalk.green;
    return color(ReplaceMessage(msg, ...args).trim());
}

export const BoldMessage = (msg: string) => chalk.bold(msg);

export const SuccessMessage = (msg: string = 'Success', ...args: string[]) => ProcessMessage('Success', msg, ...args);
export const ErrorMessage = (msg: string = 'Fail', ...args: string[]) => ProcessMessage('Error', msg, ...args);
export const WarningMessage = (msg: string = 'Skip', ...args: string[]) => ProcessMessage('Warning', msg, ...args);

export const ShortName = (name: string) => name.split('-').reduce((p, c) => p += c[0], '');

export const SelfPackageJson = () => ReadPackageJson(PathResolve());

export const ProgramInfo = (name: string = '') => {
    const {
        name: PackageName,
        version: PackageVersion,
    } = SelfPackageJson();

    let suffix = name ? `-${name}` : '',
        cmd = PackageName + suffix,
        scmd = ShortName(cmd),
        start = Date.now();

    return {
        cmd,
        scmd,
        v: PackageVersion,
        info: BoldMessage(`${cmd} v${PackageVersion}`),
        done: () => `\n${BoldMessage(cmd)} finish (${Math.round((Date.now() - start) / 1000)}s)`
    };
}

export const ValidateAppName = (appName: string = '', force: boolean = false) => {
    let msg = '';

    appName = appName.trim();
    if (appName == '') {
        if (!force) msg = 'Please specify application name';
        else appName = '.';
    } else if (/^[./]+$/.test(appName)) {
        msg = 'Invalid application name';
    }

    if (msg) {
        console.error(msg);
        process.exit(1);
    }

    return appName;
}

export const Progress = (msg: string, promiseFn: () => Promise<IProgressResponse>, exitOnFail: boolean = false) => new Promise<IProgressResponse>((resolve, reject) => {
    let pid = Math.floor(Math.random() * 9999) + 1;
    if (stack.length > 0 && stack[stack.length - 1] != prevStack) {
        process.stdout.write(`\n`);
        prevStack = stack[stack.length - 1];
    }
    stack.push(pid);
    process.stdout.write(`${msg}: ...`);
    const cb = (msgs: string[], exit: boolean = false) => {
        if (stack.length > 0 && pid == prevStack) {
            process.stdout.write(`${msg}: ...`);
            prevStack = stack[stack.length - 2] || 0;
        }
        stack.pop();
        readline.cursorTo(process.stdout, RemoveColor(msg).length + 2);
        if (msgs.length) msgs.map(msg => console.log(msg.trim()));
        if (exit) process.exit();
    }
    promiseFn()
        .then(result => {
            let msgs = [result.skip ? WarningMessage() : result.success ? SuccessMessage() : ErrorMessage()];
            if (result.message.length) msgs.push(...result.message);

            cb(msgs, !result.success && exitOnFail);
            resolve(result);
        }).catch(e => {
            cb([ErrorMessage()], exitOnFail);
            console.log(ErrorMessage());
            if (exitOnFail) process.exit();
            reject(e);
        })
})

export const HasDirOrFile = (dir: string) => {
    let has: 'none' | 'directory' | 'file' = 'none';
    try {
        let stat = statSync(dir);
        if (stat.isDirectory()) {
            has = 'directory';
        } else if (stat.isFile()) {
            has = 'file';
        }
    } catch (e) { }

    return has;
}

export const CanWriteFile = (dir: string, filename: string, force: boolean = false) => new Promise<IProgressResponse>(async resolve => {
    filename = filename.replace(/^\//, '');
    let path = `${dir}/${filename}`,
        has = {
            dir: HasDirOrFile(dir),
            file: HasDirOrFile(path),
        },
        result: IProgressResponse = {
            success: false,
            message: [],
        },
        create = true;
    if (has.dir == 'file') {
        create = false;
        result.message.push(ErrorMessage(`Cannot create directory {0}. File with identical name already exists.`, WarningMessage(dir)));
    } else if (has.dir == 'none') {
        let cDir = await CreateDir('missing', dir);
        if (!cDir.success) {
            create = false;
            result.message.push(ErrorMessage(`Cannot create directory {0}.`, WarningMessage(dir)));
        }
    }

    if (has.file == 'file' && !force) {
        create = false;
        result.skip = true;
        result.message.push(WarningMessage(`File {0} already exists.`, ErrorMessage(`${dir}/${filename}`)));
    } else if (has.file == 'directory') {
        create = false;
        result.message.push(WarningMessage(`Cannot create file {0}. Directory with identical name already exists.`, ErrorMessage(`${dir}/${filename}`)));
    }

    if (create) {
        result.success = true;
    }

    resolve(result);
})

export const WriteFile = (dir: string, filename: string, content: string, force: boolean = false) => Progress(
    `Create file ${WarningMessage(filename)}`,
    () => new Promise(async resolve => {
        let result = await CanWriteFile(dir, filename, force);
        if (result.success) {
            try {
                writeFileSync(`${dir}/${filename}`, content);
            } catch (e) {
                result.success = false;
                delete result.skip;
            }
        }

        resolve(result);
    })
)

export const PathResolve = (dir: string = '') => Path.resolve(__dirname, `../../${dir}`)

export const CopyFile = (dir: string, filename: string, ts: boolean = false, force: boolean = false) => Progress(
    `Copy file ${WarningMessage(filename)}`,
    () => new Promise(async resolve => {
        let _filename = filename.replace('.txt', '');
        if (ts) _filename = _filename.replace(/\.js(x)?$/, '.ts$1');
        let _path = `${dir}${_filename}`,
            _dir = Path.dirname(_path),
            __filename = _path.replace(_dir, ''),
            result = await CanWriteFile(_dir, __filename, force);
        if (result.success) {
            try {
                copyFileSync(PathResolve(`${FilesPath}${filename}`), _path);
            } catch (e) {
                console.log(e)
                result.success = false;
                delete result.skip;
            }
        } else if (result.skip) {
            result.success = true;
        }

        resolve(result);
    })
)

export const CreateDir = (dirType: string, dir: string, force: boolean = false) => Progress(
    `Create ${dirType} directory ${WarningMessage(dir)}`,
    () => new Promise(resolve => {
        let has = HasDirOrFile(dir),
            dirExist = has == 'directory',
            result: IProgressResponse = {
                success: false,
                message: [],
            };

        if (dirExist && !force) result.message.push(WarningMessage(`Directory {0} already exists.`, ErrorMessage(dir)));
        else if (has == 'file') result.message.push(ErrorMessage(`File with name {0} already exists.`, WarningMessage(dir)));

        if (has == 'none' || dirExist) {
            try {
                if (!dirExist) mkdirSync(dir, {
                    recursive: true,
                });
                else result.skip = true;
                result.success = true;
            } catch (e) { }
        }

        resolve(result);
    }),
    true
)

export const HasExternalCMD = (cmd: string, opts: SpawnOptionsWithoutStdio = {}) => new Promise<IProgressResponse>(async resolve => {
    let result: IProgressResponse = {
        success: false,
        message: [],
    };

    if (cmd in ExistCMD) {
        result.success = ExistCMD[cmd];
    } else {
        result.success = (await ExternalCMD(`Check command ${cmd} exist`, cmd, ['--version'], opts, true)).success;
        ExistCMD[cmd] = result.success;
        if (!result.success) result.message.push(ErrorMessage(`Command ${WarningMessage(cmd)} not found.`))
    }

    resolve(result);
})

export const ExternalCMD = (msg: string, cmd: string, args: string[] = [], opts: SpawnOptionsWithoutStdio = {}, silent: boolean = false) => new Promise<IProgressResponse>((resolve, reject) => {
    args = args.filter(v => v.trim() != '');
    const child = spawn(cmd, args, {
        shell: process.platform == 'win32',
        ...opts
    })
    let result: IProgressResponse = {
        success: false,
        message: [],
    },
        hasOutput = false;

    const cb = (data: Buffer) => {
        if (!silent) {
            process.stdout.write(`${hasOutput ? '' : '\n'}${data.toString()}`);
            hasOutput = true;
        }
    }
    child.stdout.on('data', cb);
    child.stderr.on('data', cb);
    child.on('close', code => (
        result.success = code === 0,
        hasOutput && !silent ? process.stdout.write(msg ? `${msg}:` : '') : '',
        result.success ? resolve(result) : reject(result)
    ));
})

export const RunCMD = (msg: string, cmd: string, args: string[] = [], opts: SpawnOptionsWithoutStdio = {}) => Progress(msg,
    () => new Promise<IProgressResponse>(async resolve => {
        let result = await HasExternalCMD(cmd, opts);

        try {
            if (result.success) {
                result = await ExternalCMD(msg, cmd, args, opts);
            }
            resolve(result);
        } catch (e) {
            resolve(e);
        }
    })
)