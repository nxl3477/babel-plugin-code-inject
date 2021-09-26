# babel-plugin-code-inject

这是一个 babel 插件，根据注释自动插入相应的函数调用， 并通过注释控制所插入的具体位置，同时会根据配置自动引入相关的依赖包。此外还支持代码片段的插入。


# Install

```shell
npm i babel-plugin-code-inject -D
```


# Usage

## configuration

```javascript
module.exports = {
  plugins: [
    ['code-inject', {
      log: {
        // named | default | namespaced
        kind: 'named',
        require: 'log4js'
      },
      codeTemplate: "alert('test')"
    }]
  ]
}
```


## methods

**@inject:xxx**

以注释形式声明在函数上方， `xxx`取自插件参数配置的 key， 表示改函数需要插入 `xxx`, 默认是函数调用， 如果配置提供的是字符串则认为是代码片段

**@code:xxx**

以注释形式声明在函数内部，需和`@inject:xxx` 配套使用， 就像 `async await`，表示 `xxx` 插入位置为此处， 若未手动声明则为默认插入至函数内部第一行。

```javascript
// @inject:log
function foo() {
  const c = 1
  //@code:log
  return 1
}
```


# example

**处理前的代码**

```javascript
// @inject:noRequire
const fn = () => true

// @inject:log
function foo() {
  const c = 1
  //@code:log
  return 1
}

// @inject:codeTemplate
function foo2() {
  const c = 2
  //@code:codeTemplate
  return 1
}
```


**处理后的代码**

```javascript
import { log } from 'log4js'

const fn = () => {
  log()
  return true
}

function foo() {
  const c = 1
  log()
  return 1
}

function foo() {
  const c = 2
  alert('test')
  return 1
}
```



# options

## key
用于识 `@inject:xxx` 声明, 以及非 代码片段 情况下的函数名

## String 
当值的类型为 string 时， 如下方的 `anyKey`， 表示使用的是代码段模式

```js
module.exports = {
  plugins: [
    ['code-inject', {
      anyKey: "console.log('code segment')"
    }]
  ]
}
```


## Object
当值的类型是对象， 则表示是函数调用


### kind

kind 表示导入形式。 有三种导入方式 named 、 default、 namespaced,  此设计参考 [babel-helper-module-imports](https://babeljs.io/docs/en/babel-helper-module-imports)
* named 对应 `import { a } from "b"` 形式
* default 对应 `import a from "b"` 形式
* namespaced 对应 `import * as a from "b"` 形式


### require
> 可选

require 为依赖的包名， 若不填写则表示全局方法， 则不会再进行 `import`
