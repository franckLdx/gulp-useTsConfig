
const gulp = require('gulp');
const useTsConfig = require('../index.js');

const tsConfig = './tsconfig.json';

gulp.task('pre-build', () => {
  return gulp.src(tsConfig)
    .pipe(useTsConfig.clean());
});

gulp.task('build', ['pre-build'], () => {
  return gulp.src(tsConfig)
    .pipe(useTsConfig.build());
});

gulp.task('default', ['build']);
