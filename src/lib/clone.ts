import { CreateDir, IProgressResponse, Progress, CopyFile, PathResolve } from './util';
import { readdirSync } from 'fs';
import { FilesPath } from '../variables';

export default function CloneStaticFiles(dir: string, ts: boolean = false, force: boolean = false) {
    const msg = `Clone static files`;
    return Progress(
        msg,
        () => new Promise<IProgressResponse>(async resolve => {
            let files: string[] = [],
                dirs: {
                    all: string[],
                    file: string[],
                } = {
                    all: [],
                    file: [],
                },
                result: IProgressResponse = {
                    success: true,
                    message: [],
                },
                count = {
                    dir: 0,
                    file: 0,
                    skip: 0,
                };

            const readDirectory = (path: string) => {
                readdirSync(PathResolve(path)).map(file => {
                    let src = `${path}/${file}`;
                    if (file.indexOf('.') !== -1) {
                        if (!/ts/i.test(file) || ts) {
                            files.push(src.replace(FilesPath, ''));
                            if (dirs.file.indexOf(path) == -1) dirs.file.push(path);
                        }
                    } else {
                        if (dirs.all.indexOf(path) == -1) dirs.all.push(path);
                        readDirectory(src);
                    }
                })
            }

            readDirectory(FilesPath);
            let directories = dirs.all
                .filter(v => dirs.file.indexOf(v) == -1)
                .map(v => v.replace(FilesPath, `./${dir}`));

            const filePromise = (i: number = 0) => new Promise<IProgressResponse>(resolve => {
                count.file++;
                CopyFile(dir, files[i], ts, force)
                    .then(res => {
                        result.success = result.success && res.success;
                        if (res.skip) count.skip++;
                        return result.success && i < files.length - 1 ? filePromise(i + 1) : res;
                    })
                    .then(resolve)
            });
            const dirPromise = (i: number = 0) => new Promise<IProgressResponse>(resolve => {
                count.dir++;
                CreateDir('static files', directories[i], force)
                    .then(res => {
                        result.success = result.success && res.success;
                        if (res.skip) count.skip++;
                        return result.success && i < directories.length - 1 ? dirPromise(i + 1) : res;
                    })
                    .then(resolve)
            });

            if (directories.length) await dirPromise();
            if (files.length) await filePromise();
            if (count.skip == count.dir + count.file) result.skip = true;

            resolve(result);
        })
    )
}
