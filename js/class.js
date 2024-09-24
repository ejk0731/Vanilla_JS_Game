class Hero {
  constructor(el) {
    // 넘어온 클래스 네임으로 검색해 변수에 담아줌
    this.el = document.querySelector(el);
    // console.log(this.el);

    // 히어로가 이동할 거리/ 스피드
    this.movex = 0;
    this.speed = 16;

    // 엘리먼트의 크기/위치값을 알 수 있음
    // console.log(this.el.getBoundingClientRect());

    // 화면 높이값
    // console.log(window.innerHeight)
    // 히어로의 top값
    // console.log(this.el.getBoundingClientRect().top);
    // 화면 아래를 기준으로 한 히어로의 머리 위치
    // console.log(window.innerHeight - this.el.getBoundingClientRect().top);
  }
  // 히어로의 모션을 변경
  keyMotion() {
    if(key.keyDown['left']) {
      this.el.classList.add('run');
      this.el.classList.add('flip');
      // console.log(this.position().right);

      this.movex = this.movex - this.speed;
    } else if(key.keyDown['right']) {
      this.el.classList.add('run');
      this.el.classList.remove('flip');
      // console.log(this.position().right);

      this.movex = this.movex + this.speed;
    }
    // console.log(this.movex)

    if(key.keyDown['attack']){
      this.el.classList.add('attack');
      // 공격키를 눌렀을때 인스턴스 생성
      new Bullet();
    }


    if(!key.keyDown['left'] && !key.keyDown['right']) {
      this.el.classList.remove('run');
    }

    if(!key.keyDown['attack']){
      this.el.classList.remove('attack');
    }

    // 키눌림의 딜레이 차이 때문에 움직임이 이상하게 보임
    this.el.parentNode.style.transform = `translateX(${this.movex}px)`
  }

  // 자주 사용하는 값은 공통 처리!! 
  // 화면 아래를 기준으로 top값을 설정함
  // 화면 높이 - 히어로의 top값
  // bottom : 히어로의 top값 - 히어로의 높이값(아래를 기준으로한 bottom 위치)
  // 위치값을 구할때 위 또는 아래에 기준을 두지 않으면 화면의 크기가 달라질때 위치값이 맞지 않는 상황이 생길 수 있음
  // 해상도가 달라지지 않는다면 상관없지만 웹에서 화면 크기가 변경될경우 꼭 기준을 잡아야함
  position() {
    return{
      left: this.el.getBoundingClientRect().left,
      right: this.el.getBoundingClientRect().right,
      top: gameProp.screenHeight - this.el.getBoundingClientRect().top,
      bottom: gameProp.screenHeight - this.el.getBoundingClientRect().top - this.el.getBoundingClientRect().height
    }
  }

  // getBoundingClientRect() 말고 다른방법으로~!
  size() {
    return {
      width: this.el.offsetWidth,
      height: this.el.offsetHeight
    }
  }
}

class Bullet {
  constructor() {
    // 수리검 클래스를 적용할 부모 노드 적기
    this.parentNode = document.querySelector('.game');
    this.el = document.createElement('div');
    this.el.className = 'hero_bullet';
    this.x = 0;
    this.y = 0;
    this.init();
  }
  init() {
    // console.log(hero.size())
    this.x = hero.position().left + hero.size().width / 2;
    this.y = hero.position().bottom - hero.size().height / 2;
    // 수리검은 위치값을 transform으로 잡기때문에 y좌표는 bottom기준으로 값을 빼줘야함
    // console.log('x:'+ this.x);
    // console.log('y:'+ this.y);
    this.el.style.transform = `translate(${this.x}px, ${this.y}px)`;
    this.parentNode.appendChild(this.el);
  }
}
