"use strict";
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
exports.__esModule = true;
var util_1 = require("./util");
var fs_1 = require("fs");
var variables_1 = require("../variables");
function CloneStaticFiles(dir, ts, force) {
    var _this = this;
    if (ts === void 0) { ts = false; }
    if (force === void 0) { force = false; }
    var msg = "Clone static files";
    return util_1.Progress(msg, function () { return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
        var files, dirs, result, count, readDirectory, directories, filePromise, dirPromise;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    files = [], dirs = {
                        all: [],
                        file: []
                    }, result = {
                        success: true,
                        message: []
                    }, count = {
                        dir: 0,
                        file: 0,
                        skip: 0
                    };
                    readDirectory = function (path) {
                        fs_1.readdirSync(util_1.PathResolve(path)).map(function (file) {
                            var src = path + "/" + file;
                            if (file.indexOf('.') !== -1) {
                                if (!/ts/i.test(file) || ts) {
                                    files.push(src.replace(variables_1.FilesPath, ''));
                                    if (dirs.file.indexOf(path) == -1)
                                        dirs.file.push(path);
                                }
                            }
                            else {
                                if (dirs.all.indexOf(path) == -1)
                                    dirs.all.push(path);
                                readDirectory(src);
                            }
                        });
                    };
                    readDirectory(variables_1.FilesPath);
                    directories = dirs.all
                        .filter(function (v) { return dirs.file.indexOf(v) == -1; })
                        .map(function (v) { return v.replace(variables_1.FilesPath, "./" + dir); });
                    filePromise = function (i) {
                        if (i === void 0) { i = 0; }
                        return new Promise(function (resolve) {
                            count.file++;
                            util_1.CopyFile(dir, files[i], ts, force)
                                .then(function (res) {
                                result.success = result.success && res.success;
                                if (res.skip)
                                    count.skip++;
                                return result.success && i < files.length - 1 ? filePromise(i + 1) : res;
                            })
                                .then(resolve);
                        });
                    };
                    dirPromise = function (i) {
                        if (i === void 0) { i = 0; }
                        return new Promise(function (resolve) {
                            count.dir++;
                            util_1.CreateDir('static files', directories[i], force)
                                .then(function (res) {
                                result.success = result.success && res.success;
                                if (res.skip)
                                    count.skip++;
                                return result.success && i < directories.length - 1 ? dirPromise(i + 1) : res;
                            })
                                .then(resolve);
                        });
                    };
                    if (!directories.length) return [3 /*break*/, 2];
                    return [4 /*yield*/, dirPromise()];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    if (!files.length) return [3 /*break*/, 4];
                    return [4 /*yield*/, filePromise()];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    if (count.skip == count.dir + count.file)
                        result.skip = true;
                    resolve(result);
                    return [2 /*return*/];
            }
        });
    }); }); });
}
exports["default"] = CloneStaticFiles;
