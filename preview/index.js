const { transformFromAstSync } = require('@babel/core');
const parser = require('@babel/parser');
const fs = require('fs');
const path = require('path');
const babelPluginCodeInject = require('../src/index.js');

const sourceCode = fs.readFileSync(path.join(__dirname, './sourceCode.js'), {
  encoding: 'utf-8'
});

const ast = parser.parse(sourceCode, {
  sourceType: 'unambiguous',
  plugins: ['jsx']
});

const { code } = transformFromAstSync(ast, sourceCode, {
    plugins: [[babelPluginCodeInject, {

      // named default namespaced
      testTrack: {
        kind: 'named',
        require: 'track'
      },
      noRequire: {
        kind: 'named'
      },
      testCode: "alert('插入代码测试')"
    }
  ]]
});

console.log(code)

fs.writeFileSync(path.join(__dirname, './resultCode.js'), code)