const gutil = require('gulp-util');
const through2 = require('through2');
const { TsConfig } = require('./src/tsconfig');

function getTransformPipe(transform) {
  let gotAfile = false;
  return through2.obj(function toStream(file, encoding, callback) {
    gotAfile = true;
    this.push(transform(file));
    callback();
  }).on('finish', () => {
    if (!gotAfile) {
      gutil.log(gutil.colors.red('Got no config file'));
    }
  });
}

module.exports.clean = () => {
  return getTransformPipe((file) => {
    const tsConfig = new TsConfig(file);
    return tsConfig.cleanTask();
  });
};

module.exports.build = () => {
  return getTransformPipe((file) => {
    const tsConfig = new TsConfig(file);
    return tsConfig.buildTask();
  });
};
