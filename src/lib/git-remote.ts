import { RunCMD } from "./util";

export default function GitRemoteAdd(dir: string, url: string) {
    return RunCMD(`Add Git remote url`, 'git', ['remote', 'add', 'origin', url], {
        cwd: dir,
    })
}