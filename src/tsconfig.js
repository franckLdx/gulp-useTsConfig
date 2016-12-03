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

/** Manages the tsconfig file. Most of the options of this class match tsconfig file
options. YOu need to read https://www.typescriptlang.org/docs/handbook/compiler-options.html
and https://www.typescriptlang.org/docs/handbook/tsconfig-json.html to understand this class.
properties that returns files list use tsconfig options to find what are the matching files:
ex: mapFiles return <path>/**//*.map where <path> is build based on tsconfig content. if
sourceMap is not set in the config file then mapFiles returns undefined.
*/
module.exports.TsConfig = class {
  constructor(vinylFile) {
    this._tsConfigFile = vinylFile;
    this._config = JSON.parse(this._tsConfigFile.contents);
  }

  get tsDir() {
    return normalizeDir(this._config.rootDir, this._tsConfigFile.base);
  }

  /** List of files to process. exclude has to be applied. */
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
    const files = this._config.files || [];
    return toFullPath(this.tsDir, files);
  }

  get exclude() {
    const excludes = this._config.exclude || [];
    return excludes.map(exclude => path.resolve(this.tsDir, exclude));
  }

  get allowJs() {
    return this._config.allowJs || false;
  }

  /** the destination dir. compilerOptions.outDir is not set, returns tsconfig file location */
  get outDir() {
    return normalizeDir(this.compilerOptions.outDir, this._tsConfigFile.base);
  }

  /** Return the destination javascript files */
  get jsFiles() {
    return path.join(this.outDir, '/**/*.js');
  }

  get sourceMap() {
    return this.compilerOptions.sourceMap || false;
  }

  /** Returns the sourcemap files, undefined if sourceMap is not set */
  get mapFiles() {
    return this.sourceMap ? path.join(this.outDir, '/**/*.map') : undefined;
  }

  get declaration() {
    return this.compilerOptions.declaration || false;
  }

  get declarationDir() {
    return normalizeDir(this.compilerOptions.declarationDir, this._tsConfigFile.base);
  }

  /** Returns the declaration files, undefined if declaration is not set */
  get declarationFiles() {
    return this.declaration ? path.join(this.declarationDir, '/**/*.d.ts') : undefined;
  }

  get compilerOptions() {
    return this._config.compilerOptions || {};
  }

  cleanTask() {
    const files = [];
    ([this.jsFiles, this.mapFiles, this.declarationFiles], files).reduce((result, item) => {
      if (item) {
        result.push(item);
      }
      return result;
    });
    return del(files);
  }

  buildTask() {
    const isSourcemap = this.sourceMap;
    let pipe = gulp.src(this.tsFiles);
    const excludedTsFiles = this.exclude;
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
