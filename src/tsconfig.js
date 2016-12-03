/* eslint import/no-extraneous-dependencies: 0 */
const del = require('del');
const gulp = require('gulp');
const filter = require('gulp-filter');
const typeScript = require('gulp-typeScript');
const sourcemaps = require('gulp-sourcemaps');
const path = require('path');

function toFullPath(dir, files) {
  return files.map(file => path.resolve(dir, file));
}

function normalizeDir(actualDir, defaultDir) {
  return path.normalize(actualDir || defaultDir);
}

// Files included by typeScript compiler when "files" and "include" are both left unspecified
const DEFAULT_INPUT_TS_FILES = ['**/*.ts', '**/*.d.ts', '**/*.tsx'];
// JS files included by typeScript compiler when allowJs is set to true.
const DEFAULT_INPUT_JS_FILES = ['**/*.js', '**/*.jsx'];

module.exports.TsConfig = class {
  constructor(vinylFile) {
    this._tsConfigFile = vinylFile;
    this._config = JSON.parse(this._tsConfigFile.contents);
  }

  get tsDir() {
    return normalizeDir(this._config.rootDir, this._tsConfigFile.base);
  }

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
    const includes = this._config.include || [];
    return toFullPath(this.tsDir, includes);
  }

  get files() {
    const files = this._config.file || [];
    return toFullPath(this.tsDir, files);
  }

  get excludedTsFiles() {
    const excludes = this._config.exclude || [];
    return excludes.map(exclude => path.resolve(this.tsDir, exclude));
  }

  get allowJs() {
    return this._config.allowJs || false;
  }

  get outDir() {
    return normalizeDir(this._config.compilerOptions.outDir, this._tsConfigFile.location);
  }

  get jsFiles() { return `${this.outDir}/**/*.js`; }

  get mapFiles() { return `${this.outDir}/**/*.map`; }

  get ambiantFiles() { return `${this.outDir}/**/*.d.ts`; }

  get compilerOptions() { return this._config.compilerOptions; }

  get isSourceMap() { return this._config.compilerOptions.sourceMap || false; }

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
    return pipe.pipe(gulp.dest(this.outDir));
  }
};
