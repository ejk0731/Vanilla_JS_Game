class Hero {
  constructor(el) {
    this.el = document.querySelector(el);
    this.movex = 0;
    this.speed = 11;
    // 히어로가 어느쪽을 보고있는지 변수 설정
    this.direction = 'right';
    this.attackDamage = 1000;
  }

  keyMotion() {
    if(key.keyDown['left']) {
      this.direction = 'left';
      this.el.classList.add('run');
      this.el.classList.add('flip');
      this.movex = this.movex <= 0 ? 0 : this.movex - this.speed;
    } else if(key.keyDown['right']) {
      this.direction = 'right';
      this.el.classList.add('run');
      this.el.classList.remove('flip');
      this.movex = this.movex + this.speed;
    }

    if(key.keyDown['attack']){
      if(!bulletComProp.launch) {
        this.el.classList.add('attack');
        bulletComProp.arr.push(new Bullet());
        bulletComProp.launch = true;
        // console.log(bulletComProp.arr.length);
      }
    }

    if(!key.keyDown['left'] && !key.keyDown['right']) {
      this.el.classList.remove('run');
    }

    if(!key.keyDown['attack']){
      this.el.classList.remove('attack');
      bulletComProp.launch = false; 
    }

    this.el.parentNode.style.transform = `translateX(${this.movex}px)`
  }

  position() {
    return{
      left: this.el.getBoundingClientRect().left,
      right: this.el.getBoundingClientRect().right,
      top: gameProp.screenHeight - this.el.getBoundingClientRect().top,
      bottom: gameProp.screenHeight - this.el.getBoundingClientRect().top - this.el.getBoundingClientRect().height
    }
  }

  size() {
    return {
      width: this.el.offsetWidth,
      height: this.el.offsetHeight
    }
  }
}

class Bullet {
  constructor() {
    this.parentNode = document.querySelector('.game');
    this.el = document.createElement('div');
    this.el.className = 'hero_bullet';
    this.x = 0;
    this.y = 0;
    this.speed = 30;
    this.distance = 0;
    this.bulletDirection = 'right';
    this.init();
  }

  init() {
    // 수리검이 생성될때 히어로의 방향값을 수리검의 방향값으로 넣어주기
    this.bulletDirection = hero.direction === 'left' ? 'left' : 'right';
    this.x = hero.direction === 'right' ? hero.movex + hero.size().width / 2 : hero.movex - hero.size().width / 2 ;
    this.y = hero.position().bottom - hero.size().height / 2;
    this.distance = this.x;
    this.el.style.transform = `translate(${this.x}px, ${this.y}px)`;
    this.parentNode.appendChild(this.el);
  }

  moveBullet() {
    // 반대 방향으로 가기 (반대방향으로 가면서 + 사진도 반대로 돌려주기)
    let setRotate = '';
    if(this.bulletDirection == 'left') {
      this.distance -= this.speed;
      setRotate = 'rotate(180deg)';
    } else {
      this.distance += this.speed;
    }
    this.el.style.transform = `translate(${this.distance}px, ${this.y}px) ${setRotate}`;
    this.crashBullet();
  }

  position() {
    return{
      left: this.el.getBoundingClientRect().left,
      right: this.el.getBoundingClientRect().right,
      top: gameProp.screenHeight - this.el.getBoundingClientRect().top,
      bottom: gameProp.screenHeight - this.el.getBoundingClientRect().top - this.el.getBoundingClientRect().height
    }
  } 

  crashBullet() {
    for(let j=0; j<allMosterComProp.arr.length; j++) {

      // 수리검이 몬스터랑 부딪히면 지워주기
      // 수리검이 몬스터 몸안에 들어왔을때만 지워주기
      if(this.position().left > allMosterComProp.arr[j].position().left && this.position().right < allMosterComProp.arr[j].position().right) {
        // 수리검 배열의 길이만큼 반복하는 반복문 생성
        // 충돌한 수리검을 배열에서 삭제
        for(let i=0; i < bulletComProp.arr.length; i++) {
          if(bulletComProp.arr[i] === this) {
            bulletComProp.arr.splice(i,1);
            this.el.remove();
            // console.log(bulletComProp.arr);
            allMosterComProp.arr[j].updateHp();
          }
        }
      }
    }
    // 수리검이 화면 밖을 나가면 지워주기
    if(this.position().left > gameProp.screenWidth || this.position().right < 0) {
      for(let i=0; i < bulletComProp.arr.length; i++) {
        if(bulletComProp.arr[i] === this) {
          bulletComProp.arr.splice(i,1);
          this.el.remove();
          console.log(bulletComProp.arr)
        }
      }
    }
  }
}

class Monster {
  constructor(positionX, hp) {
    this.parentNode = document.querySelector('.game');
    this.el = document.createElement('div');
    this.el.className = 'monster_box';
    this.elChildren = document.createElement('div');
    this.elChildren.className = 'monster';
    this.hpNode = document.createElement('div');
    this.hpNode.className = 'hp';
    this.hpValue = hp;
    this.hpTextNode = document.createTextNode(this.hpValue);
    this.positionX = positionX;


    this.init();
  }

  init() {
    this.hpNode.appendChild(this.hpTextNode);
    this.el.appendChild(this.hpNode);
    this.el.appendChild(this.elChildren);
    this.parentNode.appendChild(this.el);
    this.el.style.left = this.positionX + 'px';
  }

  position() {
    return{
      left: this.el.getBoundingClientRect().left,
      right: this.el.getBoundingClientRect().right,
      top: gameProp.screenHeight - this.el.getBoundingClientRect().top,
      bottom: gameProp.screenHeight - this.el.getBoundingClientRect().top - this.el.getBoundingClientRect().height
    }
  } 

  updateHp() {
    this.hpValue = Math.max(0, this.hpValue - hero.attackDamage); 
    console.log(this.hpValue); 
    this.el.children[0].innerText = this.hpValue;
  }
}
