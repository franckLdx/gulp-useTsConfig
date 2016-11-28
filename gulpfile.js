/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
const gulp = require('gulp');
const istanbul = require('gulp-istanbul');
const mocha = require('gulp-mocha');
const eslint = require('gulp-eslint');

const src = ['./index.js'];
const test = ['./test/setUpBluebird.js', './test/**/*test.js'];

gulp.task('lint', () => {
  return gulp.src(src)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('pre-test', function () {
  return gulp.src(src)
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function () {
  return gulp.src(test)
    .pipe(mocha())
    .pipe(istanbul.writeReports({ reporters: ['text', 'text-summary', 'html'] }));
});

gulp.task('default', ['lint', 'test']);
