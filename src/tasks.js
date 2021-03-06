/* eslint import/no-extraneous-dependencies: 0 */

'use strict';

const del = require('del');
const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const tslint = require('gulp-tslint');
const typeScript = require('gulp-typescript');

module.exports.clean = (tsConfig) => {
  const rawFiles = [tsConfig.jsFiles, tsConfig.mapFiles, tsConfig.declarationFiles];
  const actualfiles = rawFiles.reduce(
    (result, item) => {
      if (item) {
        result.push(item);
      }
      return result;
    },
    []
  );
  return del(actualfiles);
};

function getTsFiles(tsConfig) {
  const includeMask = tsConfig.tsFiles;
  const excludeMask = tsConfig.exclude.map((item) => `!${item}`);
  const mask = includeMask.concat(excludeMask);
  return gulp.src(mask);
}

function getSourceMapInit(tsConfig) {
  return (tsConfig.sourceMap || tsConfig.inlineSourceMap) ? sourcemaps.init() : undefined;
}

function getSourceMapWrite(tsConfig) {
  let write;
  const options = {
    sourceRoot: tsConfig.mapRoot,
    includeContent: tsConfig.inlineSources,
  };
  if (tsConfig.sourceMap) {
    write = sourcemaps.write('.', options);
  } else if (tsConfig.inlineSourceMap) {
    write = sourcemaps.write(options);
  }
  return write;
}

module.exports.build = (tsConfig) => {
  let pipe = getTsFiles(tsConfig);
  const sourceMapInit = getSourceMapInit(tsConfig);
  if (sourceMapInit) {
    pipe = pipe.pipe(sourceMapInit);
  }
  pipe = pipe.pipe(typeScript(tsConfig.compilerOptions));
  const sourceMapWrite = getSourceMapWrite(tsConfig);
  if (sourceMapWrite) {
    pipe = pipe.pipe(sourceMapWrite);
  }
  return pipe.pipe(gulp.dest(tsConfig.outDir));
};

module.exports.watch = (tsConfig) => {
  const simpleBuild = () => {
    getTsFiles(tsConfig)
      .pipe(typeScript(tsConfig.compilerOptions))
      .pipe(gulp.dest(tsConfig.outDir));
  };
  return gulp.watch('*.ts', simpleBuild);
};

module.exports.lint = ((tsConfig, tsLintOptions, reporterOptions) => {
  return getTsFiles(tsConfig)
    .pipe(tslint(tsLintOptions))
    .pipe(tslint.report(reporterOptions));
});
