const gutil = require('gulp-util');
const through2 = require('through2');
const { TsConfig } = require('./src/tsconfig');

function doSomething(transform) {
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
  return doSomething((file) => {
    const tsConfig = new TsConfig(file.path);
    return tsConfig.cleanTask();
  });
};

module.exports.build = () => {
  return doSomething((file) => {
    const tsConfig = new TsConfig(file.path);
    return tsConfig.buildTask();
  });
};
