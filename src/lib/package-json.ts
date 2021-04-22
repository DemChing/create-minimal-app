import { existsSync, readFileSync } from "fs";
import { PackageJsonFilename } from "../variables";
import { TPackageJSON, IProgressResponse, CanWriteFile, WriteFile } from "./util";

export default function CreatePackageJson(dir: string, json: TPackageJSON, force: boolean = false) {
    return new Promise<IProgressResponse>(async resolve => {
        let result = await CanWriteFile(dir, PackageJsonFilename);

        if (result.success || (result.skip && force)) {
            if (result.skip) json = {
                ...ReadPackageJson(dir),
                ...json,
            };
        }

        let writeResult = await WriteFile(dir, PackageJsonFilename, JSON.stringify(json, null, 4), force);
        result.success = writeResult.success;

        resolve(result);
    })
}

export function ReadPackageJson(dir: string) {
    let json: TPackageJSON = {},
        path = `${dir}/${PackageJsonFilename}`;
    if (existsSync(path)) json = JSON.parse(readFileSync(path, 'utf-8'));
    return json;
}