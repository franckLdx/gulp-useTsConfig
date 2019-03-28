
const gulp = require('gulp');
const useTsConfig = require('../../index.js');

const tsConfig = './tsconfig.json';

gulp.task('pre-build', () => {
  return gulp.src(tsConfig)
    .pipe(useTsConfig.clean());
});

gulp.task('build', gulp.series(['pre-build'], () => {
  return gulp.src(tsConfig)
    .pipe(useTsConfig.build());
}));

gulp.task('watch', gulp.series(['build'], () => {
  return gulp.src(tsConfig)
    .pipe(useTsConfig.watch());
}));

gulp.task('default', gulp.series(['watch']));
