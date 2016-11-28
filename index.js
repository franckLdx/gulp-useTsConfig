const del = require('del');
const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const typeScript = require('gulp-typeScript');
const path = require('path');

class TsConfig {
    constructor(tsConfigLocation) {
      this._location = path.dirname(path.resolve('.', tsConfigLocation));
      this._tsConfig = require(tsConfigLocation);
    }

    get tsDir() { return `${this._location}/${this._tsConfig.rootDir}`; }

    get tsFiles() { return `${this.tsDir}/**/*.ts`; }

    get jsDir() { return `${this._location}/${this._tsConfig.compilerOptions.outDir}`; }

    get jsFiles() { return `${this.jsDir}/**/*.js`; }

    get mapFiles() { return `${this.jsDir}/**/*.map`; }

    get ambiantFiles() { return `${this.jsDir}/**/*.d.ts`; }

    get compilerOptions() { return this._tsConfig.compilerOptions; }

    get isSourceMap() { return this._tsConfig.compilerOptions.sourceMap || false; }

    cleanBuildTask() {
      return del([this.jsFiles, this.mapFiles, this.ambiantFiles]);
    }

    buildTask() {
      const isSourcemap = this.isSourceMap;
      let pipe = gulp.src(this.tsFiles);
      if (isSourcemap) {
        pipe = pipe.pipe(sourcemaps.init());
      }
      pipe = pipe.pipe(typeScript(this.compilerOptions))
      if (isSourcemap) {
        pipe = pipe.pipe(sourcemaps.write('.'));
      }
      return pipe.pipe(gulp.dest(this.jsDir));
    }
}

module.exports = (inputFile) = {
  const tsConfig = new TsConfig(inputFile);
  return {
    build: tsConfig.buildTask(),
    clean: tsConfig.cleanTask(),
  }
};
