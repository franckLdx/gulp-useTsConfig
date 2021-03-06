/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
const gulp = require('gulp');
const mocha = require('gulp-mocha');
const eslint = require('gulp-eslint');

const src = ['./index.js', './src/**/*.js'];
const test = ['./test/**/*Test.js'];
const example = ['./example/**/*.js', '!./example/lint1/**/*.js', '!./example/lint2/**/*.js'];

gulp.task(
  'lint',
  () => gulp.src(src.concat(test).concat(example))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
);

gulp.task(
  'test',
  () => gulp.src(['test/*.js']).pipe(mocha())
);

gulp.task('default', gulp.parallel(['lint', 'test']));
