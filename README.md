# gulp-useTsConfig

> Yet another typescript plugin. This one remove the boilerplate of using gulp-typeScript. For example,
you can generate sourceMap without the burden of configuration gulp-sourcemaps plugin: you provide this plugin with a valid tsconfig.json, from your build task call useTsConfig build() and... you've done.

## Example
```javascript
const gulp = require('gulp');
const useTsConfig = require('gulp-use-tsconfig');

const tsConfig = './tsconfig.json';

gulp.task('lint', () => {
  return gulp.src(tsConfig)
    .pipe(useTsConfig.lint());
});

gulp.task('pre-build', () => {
  return gulp.src(tsConfig)
    .pipe(useTsConfig.clean()); // Remoce all .js; .map and .d.ts files
});

gulp.task('build', ['lint', 'pre-build'], () => {
  return gulp.src(tsConfig)
    .pipe(useTsConfig.build());// generates .js and optionaly .map anod/or .d.ts files
});

gulp.task('watch', ['build'], () => {
  return gulp.src(tsConfig)
    .pipe(useTsConfig.watch());
});

gulp.task('default', ['build']);
```

## Install
```
npm install --save gulp-use-tsconfig
```

## Usage

### Build
"Pipes" your tsconfig to the plugin and call _build_ method:
```javascript
const gulp = require('gulp');
const useTsConfig = require('gulp-use-tsconfig');

const tsConfig = './tsconfig.json';

gulp.task('build', ['pre-build'], () => {
  return gulp.src(tsConfig)
    .pipe(useTsConfig.build());// generates .js and optionaly .map anod/or .d.ts files
});
```
gulp-use-tsconfig analyses your tsconfig.json and does the job.

### Clean
"Pipes" your tsconfig to the plugin and call _clean_ method:
```javascript
const gulp = require('gulp');
const useTsConfig = require('gulp-use-tsconfig');

const tsConfig = './tsconfig.json';

gulp.task('pre-build', () => {
  return gulp.src(tsConfig)
    .pipe(useTsConfig.clean()); // Remoce all .js; .map and .d.ts files
});
```

### Watch
"Pipes" your tsconfig to the plugin and call _watch_ method:
```javascript
const gulp = require('gulp');
const useTsConfig = require('gulp-use-tsconfig');

const tsConfig = './tsconfig.json';

gulp.task('watch', () => {
  return gulp.src(tsConfig)
    .pipe(useTsConfig.watch()); // Remoce all .js; .map and .d.ts files
});
```

### Lint
"Pipes" your tsconfig to the plugin and call _lint_ method:
```javascript
gulp.task('lint', () => {
  return gulp.src(tsConfig)
    .pipe(useTsConfig.lint());
});
```
Lint accepts an object configuration, with two properties:
```javascript
{
  tsLintOptions : configuration of gulp-tsLint
  reporterOptions: configuration of gulp-tsLint reporter
}
```
[Click here for more information about tslint](https://www.npmjs.com/package/gulp-tslint)

Another example using some configuration options:
```javascript
gulp.task('lint', () => {
  return gulp.src(tsConfig)
    .pipe(useTsConfig.lint(
      {
        tsLintOptions: {
          formatter: 'prose',
        },
        reporterOptions: {
          summarizeFailureOutput: false,
          emitError: false,
        },
      }
    ));
});
```


### Tsconfig.json
Folowing optons of tsconfig.json is directly managed by gulp-useTsConfig:
* **rootDir** the root location of typescript files. Default: tsconfig.json location
* **include** list of glob files to include. Default: none
* **files** files to include. Default: none
* **allowJs** If true, also inclue \*\*/\*.js and \*\*/\*.jsx. Default: false
* **exclude** files to exclude. Default: none
* **outDir** Output directory. Default: Default: tsconfig.json location
* **sourceMap** Generates corresponding .map file. Default: false
* **inlineSourceMap** Emit a single file with source maps instead of having a separate file. Default false
* **inlineSources** Emit the source alongside the sourcemaps within a single file; requires. Default false
* **mapRoot** Specifies the location where debugger should locate map files instead of generated locations. Default: undefined
* **declaration** Generates corresponding .d.ts file. Default: false
* **declarationDir** Output directory for generated .d.ts file. Default: undefined

If the "files" and "include" are both left unspecified, the compiled files are \*\*/\*.ts, \*\*/\*.d.ts and \*\*/\*.tsx.

Sorry, but **outFile** is not supported yet.

## Restrictions:
Requires Node 6.0.0 or upper.
Require typescript 2.x or upper.

## License
MIT

## 1.1.7
* Now inclue watch built-in method
* Examples refactoring

## 1.1.6
* fix some imports ( [contribution of Stacy Bowler](https://github.com/sbowler) )

## 1.1.5
* Move tslint from devDep to dep

## 1.1.3 and 1.1.4:
* Update dependencies

## 1.1.2:
* Update dependencies
* Update eslint config
* Use only LF in source files

## 1.1.1:
* fix filter & outDir computing

## 1.1.0:
* lint support
