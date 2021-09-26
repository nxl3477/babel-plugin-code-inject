
// @inject:testTrack
function foo() {
  console.log('第一行')
  const c = 123
  //@code:testTrack
  return 1
}

// @inject:noRequire
const fn = () => {
	return 2
}

// @inject:testCode
const foo2 = function() {
	return 2
}



// @inject:time
class Test {
  // @inject:testTrack
  constructor() {
  }


  // @inject:testTrack
  ccc() {
  }


  // @inject:testTrack
  kkk = () => {
  }


  // @inject:testTrack
  jjj = function () {
  }

}


// 匿名函数自执行
;(/* @inject:testCode */() => 2);


// 匿名函数自执行
;(/* @inject:testTrack */() => {
});


// 匿名函数自执行
;(/* @inject:testTrack */function () {
});



export default class Clazz {
  /* @inject:testTrack */
  say() {
    console.debug("filename: (10, 12)", 3);
  }

  render() {
    return <div>{
      
    	(/* @inject:testTrack */function (){
          return 123123
        }())
    }</div>;
  }

}