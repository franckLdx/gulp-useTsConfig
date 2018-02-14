/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
const gulp = require('gulp');
const istanbul = require('gulp-istanbul');
const mocha = require('gulp-mocha');
const eslint = require('gulp-eslint');

const src = ['./index.js', './src/**/*.js'];
const test = ['./test/**/*Test.js'];
const example = ['./example/**/*.js', '!./example/lint1/**/*.js', '!./example/lint2/**/*.js'];

gulp.task('lint', () => {
  return gulp.src(src.concat(test).concat(example))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('pre-test', () => {
  return gulp.src(src)
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], () => {
  return gulp.src(test)
    .pipe(mocha())
    .pipe(istanbul.writeReports({ reporters: ['text', 'text-summary', 'html'] }));
});

gulp.task('default', ['lint', 'test']);
