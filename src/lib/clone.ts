import { CreateDir, IProgressResponse, Progress, CopyFile, PathResolve } from './util';
import { readdirSync } from 'fs';
import { FilesPath, SrcPath, DistPath } from '../variables';

interface ICloneOptions {
    ts?: boolean;
    src?: string;
    dist?: string;
}

export default function CloneStaticFiles(dir: string, {
    ts = false,
    src = '',
    dist = '',
}: ICloneOptions, force: boolean = false) {
    const msg = `Clone static files`;

    src = src || SrcPath;
    dist = dist || DistPath;
    return Progress(
        msg,
        () => new Promise<IProgressResponse>(async resolve => {
            let files: [string, string][] = [],
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

            const AppBasePath = PathResolve(dir, '.');
            const AppSrcPath = PathResolve(src, dir);
            const AppDistPath = PathResolve(dist, dir);
            const FileBasePath = PathResolve(FilesPath);
            const FilesSrcPath = PathResolve(SrcPath, FileBasePath);
            const FilesDistPath = PathResolve(DistPath, FileBasePath);
            const replacePath = (from: string) => {
                let to = PathResolve(from);
                if (to.indexOf(FilesSrcPath) != -1) to = to.replace(FilesSrcPath, AppSrcPath);
                if (to.indexOf(FilesDistPath) != -1) to = to.replace(FilesDistPath, AppDistPath);
                if (to.indexOf(FileBasePath) != -1) to = to.replace(FileBasePath, AppBasePath);

                return to.replace(AppBasePath, dir).replace(/\\/g, '/');
            }

            const readDirectory = (path: string) => {
                readdirSync(PathResolve(path)).map(file => {
                    let src = `${path}/${file}`;
                    if (file.indexOf('.') !== -1) {
                        if (!/ts/i.test(file) || ts) {
                            files.push([src, replacePath(src)]);
                            if (dirs.file.indexOf(path) == -1) dirs.file.push(path);
                        }
                    } else {
                        if (dirs.all.indexOf(src) == -1) dirs.all.push(src);
                        readDirectory(src);
                    }
                })
            }

            readDirectory(FilesPath);
            let directories = dirs.all
                .filter(v => dirs.file.indexOf(v) == -1)
                .map(v => replacePath(v));

            const filePromise = (i: number = 0) => new Promise<IProgressResponse>(resolve => {
                count.file++;
                CopyFile(files[i][0], files[i][1], ts, force)
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
