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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var package_json_1 = require("./package-json");
var util_1 = require("./util");
var Packages = {
    css: [
        'style-loader',
        'css-loader',
    ],
    scss: [
        'sass',
        'sass-loader',
    ],
    ts: [
        'ts-loader',
        'typescript',
        'fork-ts-checker-webpack-plugin',
    ],
    minify: [
        'terser-webpack-plugin',
    ],
    devServer: [
        'webpack-dev-server'
    ],
    typing: [
        'react',
        'react-dom',
    ]
};
var Dependencies = [
    'react',
    'react-dom',
];
var DevDependencies = [
    '@babel/core',
    '@babel/preset-env',
    '@babel/preset-react',
    'babel-loader',
    'webpack',
    'webpack-cli',
];
var IgnoredMessage = function (arr, isDev) {
    if (isDev === void 0) { isDev = false; }
    return "Ignored " + util_1.SuccessMessage(arr.length.toString()) + " " + (isDev ? 'development ' : '') + "Packages: " + arr.map(function (v) { return util_1.SuccessMessage(v); }).join(', ');
};
function InstallPackages(dir, _a, force) {
    var _this = this;
    var _b = _a.css, css = _b === void 0 ? false : _b, _c = _a.scss, scss = _c === void 0 ? false : _c, _d = _a.ts, ts = _d === void 0 ? false : _d, _e = _a.typing, typing = _e === void 0 ? false : _e, _f = _a.minify, minify = _f === void 0 ? false : _f, _g = _a.yarn, yarn = _g === void 0 ? false : _g, _h = _a.devServer, devServer = _h === void 0 ? false : _h;
    if (force === void 0) { force = false; }
    var dep = Dependencies, dev = DevDependencies;
    if (scss || css)
        dev = dev.concat(Packages.css);
    if (scss)
        dev = dev.concat(Packages.scss);
    if (ts)
        dev = dev.concat(Packages.ts);
    if (devServer)
        dev = dev.concat(Packages.devServer);
    if (typing || ts) {
        var typings = Packages.typing
            .filter(function (v) { return dep.indexOf(v) != -1 || dev.indexOf(v) != -1; })
            .map(function (v) { return "@types/" + v; });
        dev = dev.concat(typings);
    }
    if (minify)
        dev = dev.concat(Packages.minify);
    return util_1.Progress("Install Packages", function () { return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
        var json, ignore, result, skips, Install, cb, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    json = package_json_1.ReadPackageJson(dir), ignore = [], result = {
                        success: true,
                        message: []
                    }, skips = [];
                    if (!force && json.dependencies)
                        ignore = ignore.concat(Object.keys(json.dependencies));
                    if (!force && json.devDependencies)
                        ignore = ignore.concat(Object.keys(json.devDependencies));
                    Install = function (_dep, _yarn, isDev) {
                        if (_yarn === void 0) { _yarn = false; }
                        if (isDev === void 0) { isDev = false; }
                        var cmd = _yarn ? 'yarn' : 'npm', ins = 'add', flag = isDev ? '-D' : '', install = _dep.filter(function (v) { return ignore.indexOf(v) == -1; });
                        var cb = function (res) {
                            var checkIgnored = function (_res) {
                                if (install.length != _dep.length) {
                                    _res.message.push(IgnoredMessage(_dep.filter(function (v) { return ignore.indexOf(v) != -1; }), isDev));
                                }
                            };
                            if (!res.success && _yarn && force) {
                                return Install(_dep, false, isDev)
                                    .then(function (_res) {
                                    checkIgnored(_res);
                                    return _res;
                                });
                            }
                            else {
                                checkIgnored(res);
                                return Promise.resolve(res);
                            }
                        };
                        var promise;
                        if (install.length > 0) {
                            promise = util_1.RunCMD("Install " + install.length + " " + (isDev ? 'development ' : '') + "Packages", cmd, __spreadArrays([ins, flag], install), {
                                cwd: dir
                            });
                        }
                        else {
                            promise = Promise.resolve({
                                success: true,
                                message: [],
                                skip: true
                            });
                        }
                        return promise.then(cb)["catch"](cb);
                    };
                    cb = function (res) {
                        var _a;
                        result.success = result.success && res.success;
                        (_a = result.message).push.apply(_a, res.message);
                        skips.push(Boolean(res.skip));
                    };
                    if (!(dep.length || dev.length)) return [3 /*break*/, 5];
                    if (!dep.length) return [3 /*break*/, 2];
                    _a = cb;
                    return [4 /*yield*/, Install(dep, yarn)];
                case 1:
                    _a.apply(void 0, [_c.sent()]);
                    _c.label = 2;
                case 2:
                    if (!dev.length) return [3 /*break*/, 4];
                    _b = cb;
                    return [4 /*yield*/, Install(dev, yarn, true)];
                case 3:
                    _b.apply(void 0, [_c.sent()]);
                    _c.label = 4;
                case 4:
                    if (skips.reduce(function (p, c) { return p && c; }, true))
                        result.skip = true;
                    return [3 /*break*/, 6];
                case 5:
                    result.skip = true;
                    if (dep.length)
                        result.message.push(IgnoredMessage(dep));
                    if (dev.length)
                        result.message.push(IgnoredMessage(dev, true));
                    _c.label = 6;
                case 6:
                    resolve(result);
                    return [2 /*return*/];
            }
        });
    }); }); });
}
exports["default"] = InstallPackages;
