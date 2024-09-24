/* eslint-disable */

// 키보드 세팅하기
const key = {
  keyDown : {},
  keyValue : {
    37: "left",
    39: "right",
    // 39: "up",
    // 40: "down"
  }
}

const windowEvent = () => {
  window.addEventListener('keydown', (e) => {
    // console.log(e.key);
    // console.log(key.keyValue[e.which]);
    // if(e.which === 37 || e.which === 38)
    key.keyDown[key.keyValue[e.which]] = true;
    console.log(key.keyDown);
    hero.keyMotion();
    // console.log(e.which);
    // 누르면 true; 떼면 false;만들어주기 위해 데이터 넘겨줄라구~~
  });
  window.addEventListener('keyup', (e) => {
    // console.log(e.key)
    key.keyDown[key.keyValue[e.which]] = false;
    console.log(key.keyDown);
    hero.keyMotion();
    // 왼쪽, 오른쪽 아니면 undefined 가 나오게 됨
  });
}
let hero; // 인스턴스 생성
// 키 누를 때 키모션 메소드를 호출!
const init = () => {
  hero = new Hero('.hero');
  windowEvent();
}

window.onload = () => {
  init();
}