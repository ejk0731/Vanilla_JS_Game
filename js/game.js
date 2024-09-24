/* eslint-disable */
const key = {
  keyDown : {},
  keyValue : {
    37: "left",
    39: "right",
    88: 'attack'
  }
}

const allMosterComProp = {
  arr: []
}

// 수리검의 오브젝트와 배열 생성
// 수리검 배열 attack키를 누를때 생성되는 수리검의 모든 인스턴스 저장 
const bulletComProp = {
  launch: false,
  arr: []
}

const gameBackground = {
  gameBox: document.querySelector('.game')
}

const gameProp = {
  screenWidth: window.innerWidth,
  screenHeight: window.innerHeight
}

const renderGame = () => {
  hero.keyMotion();
  setGameBackground();
  // 수리검이 생길때마다 배열에 저장되고 새로 생길때마다 그 전에 생긴 수리검도 배열로 실행되므로 성능에 문제생길 수 있음
  bulletComProp.arr.forEach((arr, i)=> {
    console.log(bulletComProp.arr.length)
    arr.moveBullet();
  })

  allMosterComProp.arr.forEach((arr, i)=> {
    arr.moveMonster();
  })
  window.requestAnimationFrame(renderGame);
}
// 백그라운드 페럴럭스 함수 구현
const setGameBackground = () => {
  let parallaxValue = Math.min(0, (hero.movex - gameProp.screenWidth / 3) * -1);
  gameBackground.gameBox.style.transform = `translateX(${parallaxValue}px)`;
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
let monster;

const init = () => {
  hero = new Hero('.hero'); 
  allMosterComProp.arr[0] = new Monster(1700, 7777);
  // allMosterComProp.arr[1] = new Monster(1500, 5555);
  loadImg();
  windowEvent();
  renderGame();
}

window.onload = () => {
  init();
}