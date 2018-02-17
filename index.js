const gutil = require('gulp-util');
const through2 = require('through2');
const { TsConfig } = require('./src/tsconfig');
const tasks = require('./src/tasks');

function getTransformPipe(transform) {
  let gotAfile = false;

  function toStream(file, encoding, callback) {
    gotAfile = true;
    const transformer = transform(file);
    if (transformer instanceof Promise) {
      this.push(transform(file));
      callback();
      return;
    }
    transformer.on('data', (data) => {
      this.push(data);
    }).on('end', () => {
      callback();
    }).on('error', (error) => {
      callback(error);
    });
  }

  return through2.obj(toStream).on('finish', () => {
    if (!gotAfile) {
      gutil.log(gutil.colors.red('Got no config file'));
    }
  });
}

module.exports.clean = () => {
  return getTransformPipe((file) => {
    const tsConfig = new TsConfig(file);
    return tasks.clean(tsConfig);
  });
};

module.exports.watch = () => {
  return getTransformPipe((file) => {
    const tsConfig = new TsConfig(file);
    return tasks.watch(tsConfig);
  });
};


module.exports.build = () => {
  return getTransformPipe((file) => {
    const tsConfig = new TsConfig(file);
    return tasks.build(tsConfig);
  });
};

module.exports.lint = ({ tsLintOptions = {}, reporterOptions = {} } = {}) => {
  return getTransformPipe((file) => {
    const tsConfig = new TsConfig(file);
    return tasks.lint(tsConfig, tsLintOptions, reporterOptions);
  });
};
