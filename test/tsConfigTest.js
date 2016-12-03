'use strict';

const path = require('path');

const { TsConfig } = require('../src/tsconfig');
const Vinyl = require('vinyl');

const should = require('chai').should();

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
      const vinyl = getVinylFile(`${dirRef}/tsconfig.json`, {});
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

  describe('include should be well defined', function () {
    function testInclude(include) {
      const dirRef = process.cwd();
      const vinyl = getVinylFile(`${dirRef}/tsconfig.json`, {
        include,
      });
      const tsConfig = new TsConfig(vinyl);
      const expectedResult = include ? include.map(item => path.join(process.cwd(), item)) : [];
      tsConfig.include.should.be.deep.equal(expectedResult);
    }
    it('include is not defined, it should be []', function () {
      testInclude(undefined);
    });
    it('include is defined with a single value which should be returned with the relevant dir', function () {
      testInclude(['**/*.ts']);
    });
    it('include is defined with a multiple values which should be returned with the relevant dir', function () {
      testInclude(['**/*.ts', '**/*.tsx']);
    });
  });

  describe('files should be well defined', function () {
    function testFiles(files) {
      const dirRef = process.cwd();
      const vinyl = getVinylFile(`${dirRef}/tsconfig.json`, {
        files,
      });
      const tsConfig = new TsConfig(vinyl);
      const expectedResult = files ? files.map(item => path.join(process.cwd(), item)) : [];
      tsConfig.files.should.be.deep.equal(expectedResult);
    }
    it('files is not defined, it should []', function () {
      testFiles(undefined);
    });
    it('files is defined with a single value which should be returned with the relevant dir', function () {
      testFiles(['index.ts']);
    });
    it('include is defined with a multiple values which should be returned with the relevant dir', function () {
      testFiles(['index.ts', 'app.ts', 'view.tsx']);
    });
  });

  describe('exclude should be well defined', function () {
    function testExclude(exclude) {
      const dirRef = process.cwd();
      const vinyl = getVinylFile(`${dirRef}/tsconfig.json`, {
        exclude,
      });
      const tsConfig = new TsConfig(vinyl);
      const expectedResult = exclude ? exclude.map(item => path.join(process.cwd(), item)) : [];
      tsConfig.exclude.should.be.deep.equal(expectedResult);
    }
    it('file is not defined, it should be []', function () {
      testExclude(undefined);
    });
    it('file is defined with a single value which should be returned with the relevant dir', function () {
      testExclude(['index.ts']);
    });
    it('file is defined with a multiple values which should be returned with the relevant dir', function () {
      testExclude(['index.ts', 'app.ts', 'view.tsx']);
    });
  });

  describe('allowJs should be well managed', function () {
    function testAllowJs(allowJs, expected) {
      const dirRef = process.cwd();
      const vinyl = getVinylFile(`${dirRef}/tsconfig.json`, {
        allowJs,
      });
      const tsConfig = new TsConfig(vinyl);
      tsConfig.allowJs.should.be.deep.equal(expected);
    }
    it('allowJs is not defined, it should be false', function () {
      testAllowJs(undefined, false);
    });
    it('allowJs is false', function () {
      testAllowJs(false, false);
    });
    it('allowJs is true', function () {
      testAllowJs(true, true);
    });
  });

  describe('outDir should be well managed', function () {
    function testOutDir(dirRef, outDir, expected) {
      const vinyl = getVinylFile(`${dirRef}/tsconfig.json`, {
        compilerOptions: {
          outDir,
        },
      });
      const tsConfig = new TsConfig(vinyl);
      const expectedOutDir = path.normalize(expected);
      tsConfig.outDir.should.be.deep.equal(expectedOutDir);
    }
    it('outDir is not defined, it should be the file location', function () {
      const dirRef = process.cwd();
      testOutDir(dirRef, undefined, dirRef);
    });
    it('outDir is defined, it should be the destination dir', function () {
      const dirRef = process.cwd();
      const outDir = '/foo';
      testOutDir(dirRef, outDir, outDir);
    });
  });

  describe('sourceMap should be well managed', function () {
    function testSourceMap(dirRef, sourceMap, expectedSourceMap, expectedMapFiles) {
      const vinyl = getVinylFile(`${dirRef}/tsconfig.json`, {
        compilerOptions: {
          sourceMap,
        },
      });
      const tsConfig = new TsConfig(vinyl);
      tsConfig.sourceMap.should.be.deep.equal(expectedSourceMap);
      if (expectedMapFiles) {
        tsConfig.mapFiles.should.be.deep.equal(expectedMapFiles);
      } else {
        should.not.exist(tsConfig.mapFiles);
      }
    }
    it('sourceMap is not defined, should be false and have no file', function () {
      const dirRef = process.cwd();
      testSourceMap(dirRef, undefined, false, undefined);
    });
    it('sourceMap is not false, should be false and have no file', function () {
      const dirRef = process.cwd();
      testSourceMap(dirRef, false, false, undefined);
    });
    it('sourceMap is not true, should be true and have map files', function () {
      const dirRef = process.cwd();
      testSourceMap(dirRef, true, true, path.join(dirRef, '**/*.map'));
    });
  });

  describe.skip('declaration should be well managed', function () {
    function testDeclaration(dirRef, declaration, declarationDir, expectedDeclaration, expectedDeclarationFiles) {
      const vinyl = getVinylFile(`${dirRef}/tsconfig.json`, {
        compilerOptions: {
          declaration,
          declarationDir,
        },
      });
      const tsConfig = new TsConfig(vinyl);
      tsConfig.declaration.should.be.deep.equal(expectedDeclaration);
      if (expectedDeclaration) {
        tsConfig.declarationFiles.should.be.deep.equal(expectedDeclarationFiles);
      } else {
        should.not.exist(tsConfig.declarationFiles);
      }
    }
    it('sourceMap is not defined, should be false and have no file', function () {
      const dirRef = process.cwd();
      testSourceMap(dirRef, undefined, false, undefined);
    });
    it('sourceMap is not false, should be false and have no file', function () {
      const dirRef = process.cwd();
      testSourceMap(dirRef, false, false, undefined);
    });
    it('sourceMap is not true, should be true and have map files', function () {
      const dirRef = process.cwd();
      testSourceMap(dirRef, true, true, path.join(dirRef, '**/*.map'));
    });
  });
});
