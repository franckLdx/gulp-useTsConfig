const del = require('del');
const gulp = require('gulp');
const filter = require('gulp-filter');
const sourcemaps = require('gulp-sourcemaps');
const typeScript = require('gulp-typeScript');
const path = require('path');

function toFullPath(dir, files) {
  return files.map(file => path.resolve(dir, file));
}

// Files included by typeScript compiler when "files" and "include" are both left unspecified
const DEFAULT_INPUT_TS_FILES = ['**/*.ts', '**/*.d.ts', '**/*.tsx'];
// JS files included by typeScript compiler when allowJs is set to true.
const DEFAULT_INPUT_JS_FILES = ['**/*.js', '**/*.jsx'];

module.exports.TsConfig = class {
  constructor(tsConfigLocation) {
    this._tsConfig = require(tsConfigLocation);
  }

  get tsDir() { return this._tsConfig.rootDir; }

  get tsFiles() {
    let tsConfigFiles = this.include.concat(this.files);
    if (tsConfigFiles.length === 0) {
      tsConfigFiles = toFullPath(this.tsDir, DEFAULT_INPUT_TS_FILES);
    }
    if (this.allowJs) {
      tsConfigFiles = tsConfigFiles.concat(toFullPath(this.tsDir, DEFAULT_INPUT_JS_FILES));
    }
    return tsConfigFiles;
  }

  get include() {
    const includes = this._tsConfig.include || [];
    return toFullPath(this.tsDir, includes);
  }

  get files() {
    const files = this._tsConfig.file || [];
    return toFullPath(this.tsDir, files);
  }

  get excludedTsFiles() {
    const excludes = this._tsConfig.exclude || [];
    return excludes.map(exclude => path.resolve(this.tsDir, exclude));
  }

  get allowJs() {
    return this._tsConfig.allowJs || false;
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
    const excludedTsFiles = this.excludedTsFiles;
    if (excludedTsFiles.length > 0) {
      pipe = pipe.pipe(filter(excludedTsFiles));
    }
    if (isSourcemap) {
      pipe = pipe.pipe(sourcemaps.init());
    }
    pipe = pipe.pipe(typeScript(this.compilerOptions));
    if (isSourcemap) {
      pipe = pipe.pipe(sourcemaps.write('.'));
    }
    return pipe.pipe(gulp.dest(this.jsDir));
  }
};
