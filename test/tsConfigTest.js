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
    function testTsDir(dirRef, rootDir, expecteDir) {
      const actualExpecteDir = path.resolve(expecteDir);
      const expectedFiles = [
        path.join(actualExpecteDir, '**', '*.ts'),
        path.join(actualExpecteDir, '**', '*.d.ts'),
        path.join(actualExpecteDir, '**', '*.tsx'),
      ];
      const vinyl = getVinylFile(`${dirRef}/tsconfig.json`, {
        rootDir,
      });
      const tsConfig = new TsConfig(vinyl);
      tsConfig.tsDir.should.be.deep.equal(actualExpecteDir);
      tsConfig.tsFiles.should.be.deep.equal(expectedFiles);
    }
    const data = [
      {
        title: 'rootDir is not defined, tsDir should be the file path',
        dirRef: '/test',
        rootDir: undefined,
        expectedDir: '/test',
      },
      {
        title: 'rootDir is a full path, tsDir should be this path',
        dirRef: '/test',
        rootDir: process.cwd(),
        expectedDir: process.cwd(),
      },
      {
        title: 'rootDir is a relative path, tsDir should be a full path',
        dirRef: process.cwd(),
        rootDir: './ts',
        expectedDir: './ts',
      },
    ];
    data.forEach(({ title, dirRef, rootDir, expectedDir }) => {
      it(title, () => {
        testTsDir(dirRef, rootDir, expectedDir);
      });
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
    const data = [
      {
        title: 'include is not defined, it should be []',
        include: undefined,
      },
      {
        title: 'include is defined with a single value which should be returned with the relevant dir',
        include: ['**/*.ts'],
      },
      {
        title: 'include is defined with a multiple values which should be returned with the relevant dir',
        include: ['**/*.ts', '**/*.tsx'],
      },
    ];
    data.forEach(({ title, include }) => {
      it(title, () => { testInclude(include); });
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
    const data = [
      {
        title: 'files is not defined, it should []',
        files: undefined,
      },
      {
        title: 'files is not defined, it should []',
        files: ['index.ts'],
      },
      {
        title: 'include is defined with a multiple values which should be returned with the relevant dir',
        files: ['index.ts', 'app.ts', 'view.tsx'],
      },
    ];
    data.forEach(({ title, files }) => {
      it(title, () => {
        testFiles(files);
      });
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
    const data = [
      {
        title: 'exclude is not defined, it should be []',
        exclude: undefined,
      },
      {
        title: 'exclude is defined with a single value which should be returned with the relevant dir',
        exclude: ['index.ts'],
      },
      {
        title: 'exclude is defined with a multiple values which should be returned with the relevant dir',
        exclude: ['index.ts', 'app.ts', 'view.tsx'],
      },
    ];
    data.forEach(({ title, exclude }) => {
      it(title, () => {
        testExclude(exclude);
      });
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
    const data = [
      {
        title: 'allowJs is not defined, it should be false',
        allowJs: undefined,
        expected: false,
      },
      {
        title: 'allowJs is false',
        allowJs: false,
        expected: false,
      },
      {
        title: 'allowJs is true',
        allowJs: true,
        expected: true,
      },
    ];
    data.forEach(({ title, allowJs, expected }) => {
      it(title, () => {
        testAllowJs(allowJs, expected);
      });
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
      const expectedOutDir = path.resolve(expected);
      const expectedJsFiles = path.join(expectedOutDir, '**', '*.js');
      tsConfig.outDir.should.be.deep.equal(expectedOutDir);
      tsConfig.jsFiles.should.be.deep.equal(expectedJsFiles);
    }
    const data = [
      {
        title: 'outDir is not defined, it should be the file location',
        dirRef: process.cwd(),
        outDir: undefined,
        expected: process.cwd(),
      },
      {
        title: 'outDir is not defined, it should be the file location',
        dirRef: process.cwd(),
        outDir: '/foo',
        expected: '/foo',
      },
    ];
    data.forEach(({ title, dirRef, outDir, expected }) => {
      it(title, () => {
        testOutDir(dirRef, outDir, expected);
      });
    });
  });

  describe('sourceMap should be well managed', function () {
    function testSourceMap(sourceMap, expectedSourceMap, expectedMapFiles) {
      const dirRef = process.cwd();
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
    const data = [
      {
        title: 'sourceMap is not defined, should be false and have no file',
        sourceMap: undefined,
        expectedSourceMap: false,
        expectedMapFiles: undefined,
      },
      {
        title: 'sourceMap is false, should be false and have no file',
        sourceMap: false,
        expectedSourceMap: false,
        expectedMapFiles: undefined,
      },
      {
        title: 'sourceMap is true, should be true and have map files',
        sourceMap: true,
        expectedSourceMap: true,
        expectedMapFiles: path.join(process.cwd(), '**', '*.js.map'),
      },
    ];
    data.forEach(({ title, sourceMap, expectedSourceMap, expectedMapFiles }) => {
      it(title, () => {
        testSourceMap(sourceMap, expectedSourceMap, expectedMapFiles);
      });
    });
  });

  describe('Declaration should be well managed', function () {
    function testDeclaration(
      { declaration, declarationDir, outDir },
      { expectedDeclaration, expectedDeclarationDir }
    ) {
      const dirRef = process.cwd();
      const vinyl = getVinylFile(`${dirRef}/tsconfig.json`, {
        compilerOptions: {
          outDir,
          declaration,
          declarationDir,
        },
      });
      const actualExpectedDeclarationDir = expectedDeclarationDir ?
        path.resolve(expectedDeclarationDir) : undefined;
      const expectedDeclarationFiles = actualExpectedDeclarationDir ?
        path.join(actualExpectedDeclarationDir, '**', '*.d.ts') : undefined;
      const tsConfig = new TsConfig(vinyl);
      tsConfig.declaration.should.be.deep.equal(expectedDeclaration);
      if (expectedDeclaration) {
        tsConfig.declarationDir.should.be.deep.equal(actualExpectedDeclarationDir);
        tsConfig.declarationFiles.should.be.deep.equal(expectedDeclarationFiles);
      } else {
        should.not.exist(tsConfig.declarationDir);
        should.not.exist(tsConfig.declarationFiles);
      }
    }
    const data = [
      {
        title: 'declaration is not defined, this option should be false and have neither dir nor file',
        declaration: undefined,
        declarationDir: undefined,
        outDir: undefined,
        expectedDeclaration: false,
        expectedDeclarationDir: false,
      },
      {
        title: 'declaration is false, this option should be false and have neither dir nor file',
        declaration: false,
        declarationDir: undefined,
        outDir: undefined,
        expectedDeclaration: false,
        expectedDeclarationDir: false,
      },
      {
        title: 'declaration is true but neither declacationDir not outDir are defined, this option should be true, have files in the current directory',
        declaration: true,
        declarationDir: undefined,
        outDir: undefined,
        expectedDeclaration: true,
        expectedDeclarationDir: process.cwd(),
      },
      {
        title: 'declaration is true, declacationDir is not defined, outDIr is defined, this option should be true and have files in outDir',
        declaration: true,
        declarationDir: undefined,
        outDir: 'foo',
        expectedDeclaration: true,
        expectedDeclarationDir: 'foo',
      },
      {
        title: 'declaration is true, declacationDir is defined, outDir is not defined, this option should be true and have files in declarationDir',
        declaration: true,
        declarationDir: 'foo',
        outDir: undefined,
        expectedDeclaration: true,
        expectedDeclarationDir: 'foo',
      },
      {
        title: 'declaration is true, declacationDir and doutDir are defined, this option should be true and have files in declarationDir',
        declaration: true,
        declarationDir: 'dec',
        outDir: 'out',
        expectedDeclaration: true,
        expectedDeclarationDir: 'dec',
      },
    ];
    data.forEach(({ title,
        declaration, declarationDir, outDir,
        expectedDeclaration, expectedDeclarationDir }) => {
      it(title, () => {
        testDeclaration(
          { declaration, declarationDir, outDir },
          { expectedDeclaration, expectedDeclarationDir }
        );
      });
    });
  });

  describe('inlineSourceMap should be well managed', function () {
    function testInlineSourceMap(inlineSourceMap, expectedInlineSourceMap) {
      const dirRef = process.cwd();
      const vinyl = getVinylFile(`${dirRef}/tsconfig.json`, {
        compilerOptions: {
          inlineSourceMap,
        },
      });
      const tsConfig = new TsConfig(vinyl);
      tsConfig.inlineSourceMap.should.be.deep.equal(expectedInlineSourceMap);
    }
    const data = [
      { title: 'No inlineSourceMap defined, should be false', inlineSourceMap: undefined, expectedInlineSourceMap: false },
      { title: 'inlineSourceMap set to false, should be false', inlineSourceMap: false, expectedInlineSourceMap: false },
      { title: 'inlineSourceMap set to true, should be true', inlineSourceMap: true, expectedInlineSourceMap: true },
    ];
    data.forEach(({ title, inlineSourceMap, expectedInlineSourceMap }) => {
      it(title, () => {
        testInlineSourceMap(inlineSourceMap, expectedInlineSourceMap);
      });
    });
  });
});
