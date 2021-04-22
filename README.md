# create-minimal-app
Create a React application quickly. Alternative to `create-react-app`.

## Intro
Want to kickstart a React project but tired of using `create-react-app`?

Don't need any testing, server or other fancy stuff installed by `create-react-app`?

Hard disk running out of space for using `create-react-app` in multiple projects?

Here comes the `create-minimal-app`!!!

## Install
`npm install -g create-minimal-app`

## Usage
Use the command `create-minimal-app` or `cma` in short.
```
Usage:
  create-minimal-app <app-name> [options]
  cma <app-name> [options]

Options:
  -V, --version                           output the version number
  --cwd                                   creact app in current working directory
  --force                                 force processing while warning exists
  --yarn                                  use Yarn to install packages
  --author <author...>                    name of package author
  --email <email>                         email of package author
  --url <url>                             url of package author
  --ver <version>                         package version
  --desc, --description <description...>  package description
  --kw, --keywords <keywords...>          package keywords
  --bl, --browserslist <browserslist...>  package browserslist
  --repo, --repository <repository>       package repository
  --git [git-repo-url]                    create Git repository
  --css                                   include CSS related plugin for Webpack
  --sass, --scss                          include SASS/SCSS related plugin for Webpack
  --ts                                    include Typescript related plugin for Webpack
  --minify                                include code minifier plugin for Webpack
  --watch                                 Webpack watch changes
  --dev-server [port]                     port of webpack-dev-server
  --typing                                install typing packages
  --no-install                            do not install packages
  --no-clone                              do not clone static files
  -h, --help                              display help for command
```

| Option | Description | Default |
| -- | -- | -- |
| `cwd` | creact app in current working directory | `false` |
| `force` | force processing while warning exists ([usage](#force-action)) | `false` |
| `yarn` | use Yarn to install packages | `false` |
| `author <author...>` | name of package author | |
| `email <email>` | email of package author | |
| `url <url>` | url of package author | |
| `ver <version>` | package version | `1.0.0` |
| `description <description...>`<br>`desc <desc...>` | package description | |
| `keywords <keywords...>`<br>`kw <kw...>` | package keywords | |
| `browserslist <browserslist...>`<br>`bl <bl...>` | package browserslist | `['>0.25%', 'not ie 11', 'not op_mini all']` |
| `repository <repository>`<br>`repo <repo>` | package repository ([usage](#repository)) | |
| `git [git-repo-url]` | create Git repository<br>repository origin is set when providing `[git-repo-url]` ([usage](#repository)) | `false` |
| `css` | include CSS related plugin for Webpack | `false` |
| `scss`<br>`sass` | include SCSS/SASS related plugin for Webpack | `false` |
| `ts` | include Typescript related plugin for Webpack | `false` |
| `minify` | include code minifier plugin for Webpack | `false` |
| `watch` | webpack watch changes after build | `false` |
| `dev-server [port]` | set webpack dev server port<br>`9000` if only flag is set | `false` |
| `typing` | install typing packages | `false` |
| `no-install` | do not install packages | `false` |
| `no-clone` | do not clone static files ([file list](#static-files)) | `false` |

## Instruction
> Please check if the packages below can fulfil most of your requirement. It may be painful to edit `webpack.config.js`.

After running the program, you will achieve these goals:
- Install required packages
- Complete the Webpack configuration
- Create a simple demo page
- (Optional) Fill some fields in `package.json`
- (Optional) initialize Git repository

### Packages
With the default setting, you will only install the following packages:
- `react`
- `react-dom`
- `@babel/core`
- `@babel/preset-env`
- `@babel/preset-react`
- `babel-loader`
- `webpack`
- `webpack-cli`

You can choose to install extra package as you need. `webpack.config.js` will be modified according to your choice.

__CSS/SCSS/SASS__ (`--css` / `--sass, --scss`)

- `style-loader`
- `css-loader`

__SCSS/SASS__ (`--sass, --scss`)

- `sass`
- `sass-loader`

__Typescript__ (`--ts`)

- `ts-loader`
- `typescript`
- `fork-ts-checker-webpack-plugin`

__Typing__ (`--ts` / `--typing`)

- `@types/react`
- `@types/react-dom`

__Dev Server__ (`--dev-server`)
- `webpack-dev-server`

__Code Minification__ (`--minify`)

- `terser-webpack-plugin`

## Repository
You can pass `--git <git-repo-url>` or `--repo, --repository <repository>` to set the repository of your app.

Specify `--repo <repository>` only will not initialize Git repo but `--git <git-repo-url>` will, it will also set `repository` in `package.json`.

However, only `github`, `gitlab` and `bitbucket` url will be convert automatically. 

Here are some usages with explaination:
- `--repo github:user/repo`: Set `repository` as `github:user/repo` in `package.json` but not initialize a local Git repo.
- `--repo github:user/repo --git`: Set `repository` as `github:user/repo` in `package.json` and initialize a local Git repo with origin `git@github.com:user/repo.git`.
- `--git https://github.com:user/repo.git`: Set `repository` as `github:user/repo` in `package.json` and initialize a local Git repo with origin `git@github.com:user/repo.git`.

> `--repo <repository> --git` is identical to `--git <git-repo-url>`

> Only `<repository>` will be considered when using `--repo <repository> --git <git-repo-url>` together

## Force Action
By default, this program will try not to alter existed file/directory in your app directory.

Some actions are restricted by default.

You can pass `--force` to the program to bypass those limitation.

### File / Directory
Before any write to your app directory, this program check if there is a file with identical name.

By default, those files will not be modified.

> For `package.json`, it will try to merge the difference instead of completely overwrite

### Package
Before install a package, this program will check if that package is already in the `package.json`.

By default, found package will not be installed even if it is not actually installed.

### Git Initialize
Before initialize Git, this program will check if a `.git` directory already in your app directory.

By default, it will not reinitialize Git repository.

> When specified `--git [git-repo-url]` or `--repo <repository> --git`, this program will run `git remote add origin [git-repo-url]`. Passing `--force` will cause an error if `origin` is already set.

### Yarn
Before using Yarn to install package, this program check if Yarn is installed.

If Yarn is used but not installed, passing `--force` will use NPM as fallback.

## Static Files
Some static files are cloned for the demo page:
```
.
+-- dist
│   +-- index.html
+-- src
|   +-- index.jsx
+-- tsconfig.json
```

If specify `--ts`, `src/index.jsx` will rename to `src/index.tsx`.

If not specify `--ts`, `tsconfig.json` will not be cloned.

## Webpack
If you just want to focus on Webpack without those `package.json`, Git and static files, use the simplified version `create-minimal-app-webpack` or `cmaw` in short.

__Usage__

Options are same as in `create-minimal-app` ([see](#usage)).

```
Usage:
  create-minimal-app-webpack [app-name] [options]
  cmaw [app-name] [options]

Options:
  -V, --version        output the version number
  --cwd                creact app in current working directory
  --force              force processing while warning exists
  --yarn               use Yarn to install packages
  --css                include CSS related plugin for Webpack
  --sass, --scss       include SASS/SCSS related plugin for Webpack
  --ts                 include Typescript related plugin for Webpack
  --minify             include code minifier plugin for Webpack
  --watch              Webpack watch changes
  --dev-server [port]  port of webpack-dev-server
  --typing             install typing packages
  --no-install         do not install packages
  -h, --help           display help for command
```

If you don't provide the `[app-name]`, all the stuff will be placed in current working directory.

## License
Release under [MIT](LICENSE) License

## Donate
If you find this repo useful, please share to your friends. Or you can buy me a coffee:

<a href="https://www.buymeacoffee.com/demching" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>