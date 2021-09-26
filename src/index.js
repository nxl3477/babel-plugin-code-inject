const { declare } = require('@babel/helper-plugin-utils');
const importModule = require('@babel/helper-module-imports');


const babelPluginCodeInject = declare((api, options, dirname) => {
  api.assertVersion(7);



  function injectCode(path, commentPath, state) {
    const pathBody = path.get('body')
    const leadingComments = commentPath.node.leadingComments
    if(leadingComments) {
      const leadingCommentsMatched = leadingComments.filter(comment => comment.value.includes('@inject:') )
      leadingCommentsMatched.forEach(comment => {
        const injectTypeMatchRes = comment.value.match(/\@inject:(\w+)/)
        // 匹配正确
        if( injectTypeMatchRes ) {
          const injectType = injectTypeMatchRes[1]
          const sourceModuleList = Object.keys(options)
          if( sourceModuleList.includes(injectType) ) {
            // 搜索一下 body里有没有 @code:xxx
            if (pathBody.isBlockStatement()) {
              const codeIndex = pathBody.node.body.findIndex(block => block.leadingComments && block.leadingComments.some(comment => new RegExp(`@code:\s?${injectType}`).test(comment.value) ))
              if( typeof state.options[injectType] === 'string' ) {
                // 有函数体
                  if( codeIndex === -1 ) {
                    pathBody.node.body.unshift(api.template.statement(state.options[injectType])());
                  }else {
                    pathBody.node.body.splice(codeIndex, 0, api.template.statement(state.options[injectType])());
                  }
              }else {
                if( codeIndex === -1 ) {
                  pathBody.node.body.unshift(api.template.statement(`${state.options[injectType].identifierName}()`)());
                }else {
                  pathBody.node.body.splice(codeIndex, 0, api.template.statement(`${state.options[injectType].identifierName}()`)());
                }
              }
            }else {
              // 无函数体
              if( typeof state.options[injectType] === 'string' ) {
                  // 无函数体
                const ast = api.template.statement(`{${state.options[injectType]};return PREV_BODY;}`)({PREV_BODY: pathBody.node});
                pathBody.replaceWith(ast);
              }else {
                // 无函数体
                const ast = api.template.statement(`{${state.options[injectType].identifierName}();return PREV_BODY;}`)({PREV_BODY: pathBody.node});
                pathBody.replaceWith(ast);
              }
            }
          }
        }
      })
    }
  }


  return {
    visitor: {
      Program: {
        enter(path, state) {
          // 拷贝一份options  ,  原本的 options 不能操作
          state.options = JSON.parse(JSON.stringify(options))

          path.traverse({
            ImportDeclaration (curPath) {
              const requirePath = curPath.get('source').node.value;
              
              // 遍历options
              Object.keys(state.options).forEach(key => {
                const option = state.options[key]
                // 字符串不需要处理
                if( typeof option === 'string' ) {
                  return false
                }
                // 判断包相同
                if( option.require === requirePath ) {
                  const specifiers = curPath.get('specifiers')
                  // console.log('specifier.local.name', specifiers)
                  specifiers.forEach(specifier => {
                    // 找到导入的名称

                    // 如果是默认type导入
                    if( option.kind === 'default' ) {
                      if( specifier.isImportDefaultSpecifier() ) {
                        // 找到已有 default 类型的引入
                        if( specifier.node.imported.name === key ) {
                          option.identifierName = specifier.get('local').toString()
                        }
                      }
                    }

                     // 如果是 named 形式的导入
                    if( option.kind === 'named' ) {
                      // 
                      if( specifier.isImportSpecifier() ) {
                        // 找到已有 default 类型的引入
                        if( specifier.node.imported.name === key ) {
                          // local name 取到的有可能是alias 的
                          option.identifierName = specifier.get('local').toString()
                        }
                      }
                    }
                  })
                }
              })
            }
          });


          // 处理未被引入的 module
          Object.keys(state.options).forEach(key => {
            const option = state.options[key]
            // 需要require 并且未找到 identifierName 字段
            if( option.require && !option.identifierName )  {
              
              // default形式
              if( option.kind === 'default' ) {
                // 返回一个type , 一个name
                option.identifierName = importModule.addDefault(path, option.require, {
                  nameHint: path.scope.generateUid(key)
                }).name;
              }

              // named形式
              if( option.kind === 'named' ) {
                option.identifierName = importModule.addNamed(path, key, option.require, {
                  nameHint: path.scope.generateUid(key)
                }).name
              }
            }

            // 如果没有传递 require 会认为是全局方法
            if( !option.require ) {
              option.identifierName = key
            }
          })
        }
      },

      'FunctionDeclaration|ClassMethod'(path, state) {
        injectCode(path, path, state)
      },

      // 针对函数声明处理
      VariableDeclaration(path, state) {    
        const declaration = path.get('declarations.0')
        const declarationInit = declaration.get('init')

        if( declarationInit.isFunctionExpression() ) {
          injectCode(declarationInit, path, state)
        }

        if( declarationInit.isArrowFunctionExpression() ) {
          injectCode(declarationInit, path, state)
        }
      },

      ClassProperty(path, state) {
        const expression = path.get('value')
        if( expression.isFunctionExpression() ) {
          injectCode(expression, path, state)
        }

        if( expression.isArrowFunctionExpression() ) {
          injectCode(expression, path, state)
        }
      },


      // 匿名函数处理
      // 直接找表达式申明
      ExpressionStatement(path, state) {
        const expression = path.get('expression')
        // 箭头函数
        if (expression.isArrowFunctionExpression()) {
          injectCode(expression, path, state)
        }
        // 普通函数
        if ( expression.isFunctionExpression() ) {
          injectCode(expression, expression, state)
        }
      },


      CallExpression(path, state) {
        const callee = path.get('callee')
        // 箭头函数
        if (callee.isArrowFunctionExpression()) {
          injectCode(callee, path, state)
        }
        // 普通函数
        if ( callee.isFunctionExpression() ) {
          injectCode(callee, path, state)
        }
      }
    }
  }
})


module.exports = babelPluginCodeInject