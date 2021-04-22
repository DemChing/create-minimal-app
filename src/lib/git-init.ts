import { IProgressResponse, ErrorMessage, HasDirOrFile, WarningMessage, RunCMD } from './util';

export default function GitInit(dir: string, force: boolean = false) {
    return new Promise(async resolve => {
        let result: IProgressResponse = {
            success: false,
            message: [],
        };

        let has = HasDirOrFile(`${dir}/.git`),
            dirExist = has == 'directory';
        if (dirExist && !force) result.message.push(WarningMessage(`Git already initialized.`));
        else if (has == 'file') result.message.push(ErrorMessage(`File with name {0} already exists.`, WarningMessage('.git')));

        if (has == 'none' || dirExist) {
            if (!dirExist || force) {
                let initResult = await RunCMD(`Initialize Git repository`, 'git', ['init'], {
                    cwd: dir,
                });

                if (initResult.success) result.success = true;
                result.message = result.message.concat(initResult.message);
            } else {
                result.skip = true;
            }
        }

        resolve(result);
    })
}