/* eslint-disable */

// 키보드 세팅하기
const key = {
  keyDown : {},
  keyValue : {
    37: "left",
    39: "right",
    88: 'attack'
    // 39: "up",
    // 40: "down"
  }
}

const gameProp = {
  screenWidth: window.innerWidth,
  screenHeight: window.innerHeight
}

const renderGame = () => {
  hero.keyMotion();
  // 재귀호출
  window.requestAnimationFrame(renderGame);
  // 무한반복됨! 초당 약 60 FPS(프레임)으로 호출 
  // 키 값의 상태를 체크하고 히어로의 움직에 필요한 값을 변경해주기 때문에 키눌림 딜레이 없이 부드럽게 움직임
}

const windowEvent = () => {
  window.addEventListener('keydown', (e) => {
    key.keyDown[key.keyValue[e.which]] = true;
    // console.log(key.keyDown);
    // console.log(e.which);
    // 누르면 true; 떼면 false;만들어주기 위해 데이터 넘겨줄라구~~
  });
  window.addEventListener('keyup', (e) => {
    // console.log(e.key)
    key.keyDown[key.keyValue[e.which]] = false;
    // console.log(key.keyDown);
    // 왼쪽, 오른쪽 아니면 undefined 가 나오게 됨
  });
}

// 클래스가 추가될 때 이미지 로드되는 현상 없애기
const loadImg = () => {
  const preLoadImageSrc = ['../../lib/images/ninja_attack.png', '../../lib/images/ninja_run.png'];
  preLoadImageSrc.forEach(arr => {
    const img = new Image();
    img.src = arr;
  })
}

let hero; // 인스턴스 생성
// 키 누를 때 키모션 메소드를 호출!
const init = () => {
  hero = new Hero('.hero');
  loadImg();
  windowEvent();
  renderGame();
  // console.log(hero.position())
}

window.onload = () => {
  init();
}