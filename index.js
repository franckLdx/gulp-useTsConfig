const del = require('del');
const gulp = require('gulp');
const gutil = require('gulp-util');
const sourcemaps = require('gulp-sourcemaps');
const typeScript = require('gulp-typeScript');
const path = require('path');
const through2 = require('through2');

class TsConfig {
  constructor(tsConfigLocation) {
    this._tsConfig = require(tsConfigLocation);
  }

  get tsDir() { return `${this._tsConfig.rootDir}`; }

  get tsFiles() {
    const includes = this._tsConfig.include || ['/**/*.ts'];
    return includes.map(include => path.join(this.tsDir, include));
  }

  get jsDir() { return `${this._tsConfig.compilerOptions.outDir}`; }

  get jsFiles() { return `${this.jsDir}/**/*.js`; }

  get mapFiles() { return `${this.jsDir}/**/*.map`; }

  get ambiantFiles() { return `${this.jsDir}/**/*.d.ts`; }

  get compilerOptions() { return this._tsConfig.compilerOptions; }

  get isSourceMap() { return this._tsConfig.compilerOptions.sourceMap || false; }

  cleanTask() {
    return del([this.jsFiles, this.mapFiles, this.ambiantFiles]);
  }

  buildTask() {
    const isSourcemap = this.isSourceMap;
    let pipe = gulp.src(this.tsFiles);
    if (isSourcemap) {
      pipe = pipe.pipe(sourcemaps.init());
    }
    pipe = pipe.pipe(typeScript(this.compilerOptions));
    if (isSourcemap) {
      pipe = pipe.pipe(sourcemaps.write('.'));
    }
    return pipe.pipe(gulp.dest(this.jsDir));
  }
}

function doSomething(transform) {
  let gotAfile = false;
  return through2.obj(function toStream(file, encoding, callback) {
    gotAfile = true;
    this.push(transform(file));
    callback();
  }).on('finish', () => {
    if (!gotAfile) {
      gutil.log(gutil.colors.red('Got no config file'));
    }
  });
}

module.exports.clean = () => {
  return doSomething((file) => {
    const tsConfig = new TsConfig(file.path);
    return tsConfig.cleanTask();
  });
};

module.exports.build = () => {
  return doSomething((file) => {
    const tsConfig = new TsConfig(file.path);
    gutil.log(gutil.colors.red(tsConfig.tsDir));
    return tsConfig.buildTask();
  });
};
