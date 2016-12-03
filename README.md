# gulp-useTsConfig

**WORK IN PPROGRESS**

> Yet another typescript plugin. This one remove the boilerplate of using gulp-typeScript. For example,
you can generate sourceMap without using any extra gulp-sourcemaps plugin. You provide it with a
valid tsconfig.json and that's it.


## Example
```javascript
const gulp = require('gulp');
const useTsConfig = require('gulp-use-tsconfig');

const tsConfig = './tsconfig.json';

gulp.task('pre-build', () => {
  return gulp.src(tsConfig)
    .pipe(useTsConfig.clean()); // Remoce all .js; .map and .d.ts files
});

gulp.task('build', ['pre-build'], () => {
  return gulp.src(tsConfig)
    .pipe(useTsConfig.build());// generates .js and optionaly .map anod/or .d.ts files
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

### Tsconfig.json
Your tsconfig.json is analyse like so:
* **rootDir** the root location of typescript files. Default: tsconfig.json location
* **include** list of glob files to include. Default: \*\*/\*.ts
* **file** files to include. Default: none
* **allowJs** If true, also inclue \*\*/\*.js and \*\*/\*.jsx. Default: false
* **exclude** files to exclude. Default: none
* **outDir** Output directory. Default: Default: tsconfig.json location

Sorry, but **outFile** is not supported yet.

## Restrictions:
Requires Node 6.0.0 or upper.

## License
MIT
