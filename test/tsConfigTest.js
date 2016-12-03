'use strict';

const path = require('path');

const { TsConfig } = require('../src/tsconfig');
const Vinyl = require('vinyl');

require('chai').should();

function getVinylFile(filePath, content) {
  const pathData = path.parse(filePath);
  const contents = new Buffer(JSON.stringify(content));
  return new Vinyl({
    cwd: pathData.root,
    base: pathData.dir,
    filePath,
    contents,
  });
}

describe('analyseTsConfig ', function () {
  describe('tsDir should be well defined', function () {
    function testTsDir(dirRef, expected) {
      const vinyl = getVinylFile(`${dirRef}/tsconfig.json`, '{}');
      const tsConfig = new TsConfig(vinyl);
      tsConfig.tsDir.should.be.deep.equal(path.normalize(expected));
    }
    it('rootDir is not defined, tsDir should be the file path', function () {
      const dirRef = '/test';
      testTsDir(dirRef, dirRef);
    });
    it('rootDir is a full path, tsDir should be this path', function () {
      const dirRef = process.cwd();
      testTsDir(dirRef, dirRef);
    });
    it('rootDir is a relative path, tsDir should be a full path', function () {
      const dirRef = './ts';
      testTsDir(dirRef, dirRef);
    });
  });
});
