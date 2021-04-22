#!/usr/bin/env node
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var commander_1 = require("commander");
var package_install_1 = __importDefault(require("./lib/package-install"));
var util_1 = require("./lib/util");
var webpack_1 = __importDefault(require("./lib/webpack"));
process.on('unhandledRejection', function (err) {
    process.stdout.write('\n\n\n');
    console.error(err);
});
var program = new commander_1.Command();
var _a = util_1.ProgramInfo('webpack'), PackageName = _a.cmd, PackageAlias = _a.scmd, PackageVersion = _a.v, PackageHelpText = _a.info, PackageDone = _a.done;
program
    .name(PackageName)
    .alias(PackageAlias)
    .version(PackageVersion)
    .addHelpText('before', PackageHelpText)
    .arguments('[app-name]')
    .option('--cwd', 'creact app in current working directory')
    .option('--force', 'force processing while warning exists')
    .option('--yarn', 'use Yarn to install packages')
    .option('--css', 'include CSS related plugin for Webpack')
    .option('--sass, --scss', 'include SASS/SCSS related plugin for Webpack')
    .option('--ts', 'include Typescript related plugin for Webpack')
    .option('--minify', 'include code minifier plugin for Webpack')
    .option('--watch', 'Webpack watch changes')
    .option('--dev-server [port]', 'port of webpack-dev-server')
    .option('--typing', 'install typing packages')
    .option('--no-install', 'do not install packages')
    .action(function (appName, options) { return __awaiter(void 0, void 0, void 0, function () {
    var cwd;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(PackageHelpText + "\n");
                appName = appName || '';
                if (!options.cwd)
                    appName = util_1.ValidateAppName(appName, true);
                cwd = options.cwd ? '.' : appName;
                if (!!options.cwd) return [3 /*break*/, 2];
                return [4 /*yield*/, util_1.CreateDir('application', cwd, options.force)];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [4 /*yield*/, webpack_1["default"](cwd, {
                    css: options.css,
                    scss: options.scss,
                    ts: options.ts,
                    minify: options.minify,
                    watch: options.watch,
                    devServer: options.devServer
                }, options.force)];
            case 3:
                _a.sent();
                if (!options.install) return [3 /*break*/, 5];
                return [4 /*yield*/, package_install_1["default"](cwd, {
                        css: options.css,
                        scss: options.scss,
                        ts: options.ts,
                        typing: options.typing,
                        minify: options.minify,
                        devServer: options.devServer,
                        yarn: options.yarn
                    }, options.force)];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5:
                console.log(PackageDone());
                return [2 /*return*/];
        }
    });
}); });
program.parse();
