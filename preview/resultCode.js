import { testTrack as _testTrack2 } from "track";

// @inject:testTrack
function foo() {
  console.log('第一行');
  const c = 123; //@code:testTrack

  _testTrack2();

  return 1;
} // @inject:noRequire


const fn = () => {
  noRequire();
  return 2;
}; // @inject:testCode


const foo2 = function () {
  alert('插入代码测试');
  return 2;
}; // @inject:time


class Test {
  // @inject:testTrack
  constructor() {
    _testTrack2();
  } // @inject:testTrack


  ccc() {
    _testTrack2();
  } // @inject:testTrack


  kkk = () => {
    _testTrack2();
  }; // @inject:testTrack

  jjj = function () {
    _testTrack2();
  };
} // 匿名函数自执行


;

/* @inject:testCode */
() => 2; // 匿名函数自执行


;

/* @inject:testTrack */
() => {}; // 匿名函数自执行


;

(
/* @inject:testTrack */
function () {
  _testTrack2();
});

export default class Clazz {
  /* @inject:testTrack */
  say() {
    _testTrack2();

    console.debug("filename: (10, 12)", 3);
  }

  render() {
    return <div>{
      /* @inject:testTrack */
      function () {
        _testTrack2();

        return 123123;
      }()}</div>;
  }

}