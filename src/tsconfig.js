'use strict';

const path = require('path');

/** Add full path to each files */
function toFullPath(dir, files) {
  return files.map(file => path.resolve(dir, file));
}

/** Resolve and Nomaliz a path relative to a refDir */
function normalizeDir(actualDir, refDir) {
  const dir = actualDir ? path.resolve(refDir, actualDir) : path.resolve(refDir);
  return path.normalize(dir);
}

// Files included by typeScript compiler when "files" and "include" are both left unspecified
const DEFAULT_INPUT_TS_FILES = ['**/*.ts', '**/*.d.ts', '**/*.tsx'];
// JS files included by typeScript compiler when allowJs is set to true.
const DEFAULT_INPUT_JS_FILES = ['**/*.js', '**/*.jsx'];

/** Manages the tsconfig file. Most of the options of this class match tsconfig file
options. YOu need to read https://www.typescriptlang.org/docs/handbook/compiler-options.html
and https://www.typescriptlang.org/docs/handbook/tsconfig-json.html to understand this class.
properties that returns files list use tsconfig options to find what are the matching files:
ex: mapFiles return <path>\/**\/\/*.map where <path> is build based on tsconfig content. if
sourceMap is not set in the config file then mapFiles returns undefined.
*/
module.exports.TsConfig = class {
  constructor(vinylFile) {
    this._tsConfigFile = vinylFile;
    this._config = JSON.parse(this._tsConfigFile.contents);
  }

  /** Returns tsDir: it's rootDir if defined. default: tsconfig file location */
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

  /** The inclue option. Default: [] */
  get include() {
    const includes = this._config.include || [];
    return toFullPath(this.tsDir, includes);
  }

  /** The files option. Default: [] */
  get files() {
    const files = this._config.files || [];
    return toFullPath(this.tsDir, files);
  }

  /** Exclude option? Defualt: [] */
  get exclude() {
    const excludes = this._config.exclude || [];
    return excludes.map(exclude => path.resolve(this.tsDir, exclude));
  }

  /** AllowJs option. Default: false */
  get allowJs() {
    return this._config.allowJs || false;
  }

  /** the destination dir. compilerOptions.outDir is not set, returns tsconfig file location */
  get outDir() {
    return normalizeDir(this.compilerOptions.outDir, this._tsConfigFile.base);
  }

  /** Return the destination javascript files */
  get jsFiles() {
    return path.join(this.outDir, '**', '*.js');
  }

  /** sourceMap option. Default: false */
  get sourceMap() {
    return this.compilerOptions.sourceMap || false;
  }

  /** inineSourceMap option. Default: false */
  get inlineSourceMap() {
    return this.compilerOptions.inlineSourceMap || false;
  }

  /** inlinceSources options. Default: false */
  get inlineSources() {
    return this.compilerOptions.inlineSources || false;
  }

  /** mapRoot options. Default: false */
  get mapRoot() {
    return this.compilerOptions.mapRoot || false;
  }

  /** Returns the sourcemap files, undefined if sourceMap is not set */
  get mapFiles() {
    return this.sourceMap ? path.join(this.outDir, '**', '*.js.map') : undefined;
  }

  /** declration options. Default: false */
  get declaration() {
    return this.compilerOptions.declaration || false;
  }

  /** declration dir. Default: undefined */
  get declarationDir() {
    return this.declaration ?
      normalizeDir(this.compilerOptions.declarationDir, this.outDir) : undefined;
  }

  /** Returns the declaration files, undefined if declaration is not set */
  get declarationFiles() {
    return this.declaration ? path.join(this.declarationDir, '**', '*.d.ts') : undefined;
  }

  /** compilerOptions section. Default: {} */
  get compilerOptions() {
    return this._config.compilerOptions || {};
  }
};
