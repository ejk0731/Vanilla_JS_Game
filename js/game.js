/* eslint-disable */
const key = {
  keyDown : {},
  keyValue : {
    37: "left",
    39: "right",
    88: 'attack'
  }
}

// 수리검의 오브젝트와 배열 생성
// 수리검 배열 attack키를 누를때 생성되는 수리검의 모든 인스턴스 저장 
const bulletComProp = {
  launch: false,
  arr: []
}

const gameProp = {
  screenWidth: window.innerWidth,
  screenHeight: window.innerHeight
}

const renderGame = () => {
  hero.keyMotion();
  bulletComProp.arr.forEach((arr, i)=> {
    arr.moveBullet();
  })
  window.requestAnimationFrame(renderGame);
}

const windowEvent = () => {
  window.addEventListener('keydown', (e) => {
    key.keyDown[key.keyValue[e.which]] = true;
  });
  window.addEventListener('keyup', (e) => {
    key.keyDown[key.keyValue[e.which]] = false;
  });
  // 자주 쓰이는 것들은 공통으로 관리!! 
  window.addEventListener('resize', e => {
    gameProp.screenWidth = window.innerWidth;
    gameProp.screenHeight = window.innerHeight;
  })
}

const loadImg = () => {
  const preLoadImageSrc = ['../../lib/images/ninja_attack.png', ['../../lib/images/ninja_run.png']];
  preLoadImageSrc.forEach(arr => {
    const img = new Image();
    img.src = arr;
  })
}

let hero; 

const init = () => {
  hero = new Hero('.hero');
  loadImg();
  windowEvent();
  renderGame();
}

window.onload = () => {
  init();
}