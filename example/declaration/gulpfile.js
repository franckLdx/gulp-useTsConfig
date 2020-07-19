const gulp = require('gulp');
const useTsConfig = require('../../index.js');

const tsConfig = './tsconfig.json';

gulp.task('pre-build', gulp.series(
  () => gulp.src(tsConfig).pipe(useTsConfig.clean())
));

gulp.task('build', gulp.series(
  'pre-build',
  () => gulp.src(tsConfig).pipe(useTsConfig.build())
));

gulp.task('default', gulp.series('build'));
