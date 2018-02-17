/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

const gulp = require('gulp');
const useTsConfig = require('../../index.js');

const tsConfig = './tsconfig.json';

gulp.task('lint', () => {
  return gulp.src(tsConfig)
    .pipe(useTsConfig.lint(
      {
        tsLintOptions: {
          formatter: 'prose',
        },
        reporterOptions: {
          summarizeFailureOutput: false,
          emitError: false,
        },
      }
    ));
});

gulp.task('pre-build', () => {
  return gulp.src(tsConfig)
    .pipe(useTsConfig.clean());
});

gulp.task('build', ['lint', 'pre-build'], () => {
  return gulp.src(tsConfig)
    .pipe(useTsConfig.build());
});

gulp.task('default', ['build']);
