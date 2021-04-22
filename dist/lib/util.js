"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.RunCMD = exports.ExternalCMD = exports.HasExternalCMD = exports.CreateDir = exports.CopyFile = exports.PathResolve = exports.WriteFile = exports.CanWriteFile = exports.HasDirOrFile = exports.Progress = exports.ValidateAppName = exports.ProgramInfo = exports.SelfPackageJson = exports.ShortName = exports.WarningMessage = exports.ErrorMessage = exports.SuccessMessage = exports.BoldMessage = void 0;
var chalk_1 = __importDefault(require("chalk"));
var path_1 = __importDefault(require("path"));
var readline_1 = __importDefault(require("readline"));
var fs_1 = require("fs");
var child_process_1 = require("child_process");
var variables_1 = require("../variables");
var package_json_1 = require("./package-json");
var ExistCMD = {
    npm: true
}, stack = [], prevStack = 0;
var RemoveColor = function (msg) { return msg.replace(/\x1B[[(?);]{0,2}(;?\d)*./g, ''); };
var ReplaceMessage = function (msg) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    for (var i = 0; i < args.length; i++) {
        msg = msg.replace("{" + i + "}", args[i]);
    }
    return msg;
};
var ProcessMessage = function (msgType, msg) {
    if (msg === void 0) { msg = ''; }
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    var color = msgType === 'Error' ? chalk_1["default"].red : msgType === 'Warning' ? chalk_1["default"].yellow : chalk_1["default"].green;
    return color(ReplaceMessage.apply(void 0, __spreadArrays([msg], args)).trim());
};
exports.BoldMessage = function (msg) { return chalk_1["default"].bold(msg); };
exports.SuccessMessage = function (msg) {
    if (msg === void 0) { msg = 'Success'; }
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return ProcessMessage.apply(void 0, __spreadArrays(['Success', msg], args));
};
exports.ErrorMessage = function (msg) {
    if (msg === void 0) { msg = 'Fail'; }
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return ProcessMessage.apply(void 0, __spreadArrays(['Error', msg], args));
};
exports.WarningMessage = function (msg) {
    if (msg === void 0) { msg = 'Skip'; }
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return ProcessMessage.apply(void 0, __spreadArrays(['Warning', msg], args));
};
exports.ShortName = function (name) { return name.split('-').reduce(function (p, c) { return p += c[0]; }, ''); };
exports.SelfPackageJson = function () { return package_json_1.ReadPackageJson(exports.PathResolve()); };
exports.ProgramInfo = function (name) {
    if (name === void 0) { name = ''; }
    var _a = exports.SelfPackageJson(), PackageName = _a.name, PackageVersion = _a.version;
    var suffix = name ? "-" + name : '', cmd = PackageName + suffix, scmd = exports.ShortName(cmd), start = Date.now();
    return {
        cmd: cmd,
        scmd: scmd,
        v: PackageVersion,
        info: exports.BoldMessage(cmd + " v" + PackageVersion),
        done: function () { return "\n" + exports.BoldMessage(cmd) + " finish (" + Math.round((Date.now() - start) / 1000) + "s)"; }
    };
};
exports.ValidateAppName = function (appName, force) {
    if (appName === void 0) { appName = ''; }
    if (force === void 0) { force = false; }
    var msg = '';
    appName = appName.trim();
    if (appName == '') {
        if (!force)
            msg = 'Please specify application name';
        else
            appName = '.';
    }
    else if (/^[./]+$/.test(appName)) {
        msg = 'Invalid application name';
    }
    if (msg) {
        console.error(msg);
        process.exit(1);
    }
    return appName;
};
exports.Progress = function (msg, promiseFn, exitOnFail) {
    if (exitOnFail === void 0) { exitOnFail = false; }
    return new Promise(function (resolve, reject) {
        var pid = Math.floor(Math.random() * 9999) + 1;
        if (stack.length > 0 && stack[stack.length - 1] != prevStack) {
            process.stdout.write("\n");
            prevStack = stack[stack.length - 1];
        }
        stack.push(pid);
        process.stdout.write(msg + ": ...");
        var cb = function (msgs, exit) {
            if (exit === void 0) { exit = false; }
            if (stack.length > 0 && pid == prevStack) {
                process.stdout.write(msg + ": ...");
                prevStack = stack[stack.length - 2] || 0;
            }
            stack.pop();
            readline_1["default"].cursorTo(process.stdout, RemoveColor(msg).length + 2);
            if (msgs.length)
                msgs.map(function (msg) { return console.log(msg.trim()); });
            if (exit)
                process.exit();
        };
        promiseFn()
            .then(function (result) {
            var msgs = [result.skip ? exports.WarningMessage() : result.success ? exports.SuccessMessage() : exports.ErrorMessage()];
            if (result.message.length)
                msgs.push.apply(msgs, result.message);
            cb(msgs, !result.success && exitOnFail);
            resolve(result);
        })["catch"](function (e) {
            cb([exports.ErrorMessage()], exitOnFail);
            console.log(exports.ErrorMessage());
            if (exitOnFail)
                process.exit();
            reject(e);
        });
    });
};
exports.HasDirOrFile = function (dir) {
    var has = 'none';
    try {
        var stat = fs_1.statSync(dir);
        if (stat.isDirectory()) {
            has = 'directory';
        }
        else if (stat.isFile()) {
            has = 'file';
        }
    }
    catch (e) { }
    return has;
};
exports.CanWriteFile = function (dir, filename, force) {
    if (force === void 0) { force = false; }
    return new Promise(function (resolve) { return __awaiter(void 0, void 0, void 0, function () {
        var path, has, result, create, cDir;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    filename = filename.replace(/^\//, '');
                    path = dir + "/" + filename, has = {
                        dir: exports.HasDirOrFile(dir),
                        file: exports.HasDirOrFile(path)
                    }, result = {
                        success: false,
                        message: []
                    }, create = true;
                    if (!(has.dir == 'file')) return [3 /*break*/, 1];
                    create = false;
                    result.message.push(exports.ErrorMessage("Cannot create directory {0}. File with identical name already exists.", exports.WarningMessage(dir)));
                    return [3 /*break*/, 3];
                case 1:
                    if (!(has.dir == 'none')) return [3 /*break*/, 3];
                    return [4 /*yield*/, exports.CreateDir('missing', dir)];
                case 2:
                    cDir = _a.sent();
                    if (!cDir.success) {
                        create = false;
                        result.message.push(exports.ErrorMessage("Cannot create directory {0}.", exports.WarningMessage(dir)));
                    }
                    _a.label = 3;
                case 3:
                    if (has.file == 'file' && !force) {
                        create = false;
                        result.skip = true;
                        result.message.push(exports.WarningMessage("File {0} already exists.", exports.ErrorMessage(dir + "/" + filename)));
                    }
                    else if (has.file == 'directory') {
                        create = false;
                        result.message.push(exports.WarningMessage("Cannot create file {0}. Directory with identical name already exists.", exports.ErrorMessage(dir + "/" + filename)));
                    }
                    if (create) {
                        result.success = true;
                    }
                    resolve(result);
                    return [2 /*return*/];
            }
        });
    }); });
};
exports.WriteFile = function (dir, filename, content, force) {
    if (force === void 0) { force = false; }
    return exports.Progress("Create file " + exports.WarningMessage(filename), function () { return new Promise(function (resolve) { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.CanWriteFile(dir, filename, force)];
                case 1:
                    result = _a.sent();
                    if (result.success) {
                        try {
                            fs_1.writeFileSync(dir + "/" + filename, content);
                        }
                        catch (e) {
                            result.success = false;
                            delete result.skip;
                        }
                    }
                    resolve(result);
                    return [2 /*return*/];
            }
        });
    }); }); });
};
exports.PathResolve = function (dir) {
    if (dir === void 0) { dir = ''; }
    return path_1["default"].resolve(__dirname, "../../" + dir);
};
exports.CopyFile = function (dir, filename, ts, force) {
    if (ts === void 0) { ts = false; }
    if (force === void 0) { force = false; }
    return exports.Progress("Copy file " + exports.WarningMessage(filename), function () { return new Promise(function (resolve) { return __awaiter(void 0, void 0, void 0, function () {
        var _filename, _path, _dir, __filename, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _filename = filename.replace('.txt', '');
                    if (ts)
                        _filename = _filename.replace(/\.js(x)?$/, '.ts$1');
                    _path = "" + dir + _filename, _dir = path_1["default"].dirname(_path), __filename = _path.replace(_dir, '');
                    return [4 /*yield*/, exports.CanWriteFile(_dir, __filename, force)];
                case 1:
                    result = _a.sent();
                    if (result.success) {
                        try {
                            fs_1.copyFileSync(exports.PathResolve("" + variables_1.FilesPath + filename), _path);
                        }
                        catch (e) {
                            console.log(e);
                            result.success = false;
                            delete result.skip;
                        }
                    }
                    else if (result.skip) {
                        result.success = true;
                    }
                    resolve(result);
                    return [2 /*return*/];
            }
        });
    }); }); });
};
exports.CreateDir = function (dirType, dir, force) {
    if (force === void 0) { force = false; }
    return exports.Progress("Create " + dirType + " directory " + exports.WarningMessage(dir), function () { return new Promise(function (resolve) {
        var has = exports.HasDirOrFile(dir), dirExist = has == 'directory', result = {
            success: false,
            message: []
        };
        if (dirExist && !force)
            result.message.push(exports.WarningMessage("Directory {0} already exists.", exports.ErrorMessage(dir)));
        else if (has == 'file')
            result.message.push(exports.ErrorMessage("File with name {0} already exists.", exports.WarningMessage(dir)));
        if (has == 'none' || dirExist) {
            try {
                if (!dirExist)
                    fs_1.mkdirSync(dir, {
                        recursive: true
                    });
                else
                    result.skip = true;
                result.success = true;
            }
            catch (e) { }
        }
        resolve(result);
    }); }, true);
};
exports.HasExternalCMD = function (cmd, opts) {
    if (opts === void 0) { opts = {}; }
    return new Promise(function (resolve) { return __awaiter(void 0, void 0, void 0, function () {
        var result, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    result = {
                        success: false,
                        message: []
                    };
                    if (!(cmd in ExistCMD)) return [3 /*break*/, 1];
                    result.success = ExistCMD[cmd];
                    return [3 /*break*/, 3];
                case 1:
                    _a = result;
                    return [4 /*yield*/, exports.ExternalCMD("Check command " + cmd + " exist", cmd, ['--version'], opts, true)];
                case 2:
                    _a.success = (_b.sent()).success;
                    ExistCMD[cmd] = result.success;
                    if (!result.success)
                        result.message.push(exports.ErrorMessage("Command " + exports.WarningMessage(cmd) + " not found."));
                    _b.label = 3;
                case 3:
                    resolve(result);
                    return [2 /*return*/];
            }
        });
    }); });
};
exports.ExternalCMD = function (msg, cmd, args, opts, silent) {
    if (args === void 0) { args = []; }
    if (opts === void 0) { opts = {}; }
    if (silent === void 0) { silent = false; }
    return new Promise(function (resolve, reject) {
        args = args.filter(function (v) { return v.trim() != ''; });
        var child = child_process_1.spawn(cmd, args, __assign({ shell: process.platform == 'win32' }, opts));
        var result = {
            success: false,
            message: []
        }, hasOutput = false;
        var cb = function (data) {
            if (!silent) {
                process.stdout.write("" + (hasOutput ? '' : '\n') + data.toString());
                hasOutput = true;
            }
        };
        child.stdout.on('data', cb);
        child.stderr.on('data', cb);
        child.on('close', function (code) { return (result.success = code === 0,
            hasOutput && !silent ? process.stdout.write(msg ? msg + ":" : '') : '',
            result.success ? resolve(result) : reject(result)); });
    });
};
exports.RunCMD = function (msg, cmd, args, opts) {
    if (args === void 0) { args = []; }
    if (opts === void 0) { opts = {}; }
    return exports.Progress(msg, function () { return new Promise(function (resolve) { return __awaiter(void 0, void 0, void 0, function () {
        var result, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.HasExternalCMD(cmd, opts)];
                case 1:
                    result = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    if (!result.success) return [3 /*break*/, 4];
                    return [4 /*yield*/, exports.ExternalCMD(msg, cmd, args, opts)];
                case 3:
                    result = _a.sent();
                    _a.label = 4;
                case 4:
                    resolve(result);
                    return [3 /*break*/, 6];
                case 5:
                    e_1 = _a.sent();
                    resolve(e_1);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); }); });
};
