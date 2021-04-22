"use strict";
exports.__esModule = true;
var util_1 = require("./util");
function GitRemoteAdd(dir, url) {
    return util_1.RunCMD("Add Git remote url", 'git', ['remote', 'add', 'origin', url], {
        cwd: dir
    });
}
exports["default"] = GitRemoteAdd;
