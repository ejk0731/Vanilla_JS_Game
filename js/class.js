class Hero {
  constructor(el) {
    // 넘어온 클래스 네임으로 검색해 변수에 담아줌
    this.el = document.querySelector(el);
    // console.log(this.el);

    // 히어로가 이동할 거리/ 스피드
    this.movex = 0;
    this.speed = 16;
  }
  // 히어로의 모션을 변경
  keyMotion() {
    if(key.keyDown['left']) {
      this.el.classList.add('run');
      this.el.classList.add('flip');

      this.movex = this.movex - this.speed;
    } else if(key.keyDown['right']) {
      this.el.classList.add('run');
      this.el.classList.remove('flip');

      this.movex = this.movex + this.speed;
    }
    // console.log(this.movex)

    if(key.keyDown['attack']){
      this.el.classList.add('attack');
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
}
