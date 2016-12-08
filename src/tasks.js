/* eslint import/no-extraneous-dependencies: 0 */

'use strict';

const del = require('del');
const gulp = require('gulp');
const filter = require('gulp-filter');
const typeScript = require('gulp-typeScript');
const sourcemaps = require('gulp-sourcemaps');

module.exports.clean = (tsConfig) => {
  const rawFiles = [tsConfig.jsFiles, tsConfig.mapFiles, tsConfig.declarationFiles];
  const actualfiles = [];
  (rawFiles, actualfiles).reduce((result, item) => {
    if (item) {
      result.push(item);
    }
    return result;
  });
  return del(actualfiles);
};

module.exports.build = (tsConfig) => {
  const isSourcemap = tsConfig.sourceMap;
  let pipe = gulp.src(tsConfig.tsFiles);
  const excludedTsFiles = tsConfig.exclude;
  if (excludedTsFiles.length > 0) {
    pipe = pipe.pipe(filter(excludedTsFiles));
  }
  if (isSourcemap) {
    pipe = pipe.pipe(sourcemaps.init());
  }
  pipe = pipe.pipe(typeScript(tsConfig.compilerOptions));
  if (isSourcemap) {
    pipe = pipe.pipe(sourcemaps.write('.'));
  }
  return pipe.pipe(gulp.dest(tsConfig.outDir));
};
