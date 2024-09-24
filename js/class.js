class Hero {
  constructor(el) {
    this.el = document.querySelector(el);
    this.movex = 0;
    this.speed = 11;
    // 히어로가 어느쪽을 보고있는지 변수 설정
    this.direction = 'right';
    this.attackDamage = 1000;
    this.hpProgress = 0;
    this.hpValue = 10000;
    this.defaultHpValue = this.hpValue;
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

  updateHp(monsterDamage) {
    this.hpValue = Math.max(0, this.hpValue - monsterDamage);
    this.hpProgress = this.hpValue / this.defaultHpValue * 100;
    console.log(this.hpValue);
    const heroHpBox = document.querySelector('.state_box .hp span');
    heroHpBox.style.width = this.hpProgress + '%';
    this.crash();
    if(this.hpValue === 0) {
      this.dead();
    }
  }

  crash() {
    this.el.classList.add('crash');
    setTimeout(()=>{this.el.classList.remove('crash')}, 400)
  }

  dead() {
    this.el.classList.add('dead');
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
            // 충돌한 몬스터의 배열값 j를 넘겨줌
            allMosterComProp.arr[j].updateHp(j);
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
    this.defaultHpValue = hp;
    this.progress = 0;
    this.hpInner = document.createElement('span');
    this.positionX = positionX;
    this.moveX = 0;
    this.speed = 10;
    this.crashDamage = 100;

    this.init();
  }

  init() {
    this.hpNode.appendChild(this.hpInner);
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

  updateHp(index) {
    this.hpValue = Math.max(0, this.hpValue - hero.attackDamage); 
    this.progress = this.hpValue / this.defaultHpValue * 100;
    // console.log(this.el.children[0].children[0]);
    this.el.children[0].children[0].style.width = this.progress + '%'; 
    // console.log(this.hpValue); 

    if(this.hpValue === 0) {
      this.dead(index);
    }
  }

  dead(index) {
    this.el.classList.add('remove');
    setTimeout(() => this.el.remove(), 200);
    allMosterComProp.arr.splice(index, 1);
    console.log(allMosterComProp.arr);
  }

  moveMonster() {
    if(this.moveX + this.positionX + this.el.offsetWidth + hero.position().left - hero.movex <= 0) {
      this.moveX = hero.movex - this.positionX + gameProp.screenWidth - hero.position().left;
    } else {
      this.moveX -= this.speed;
    }
    // 이 값이 0 보다 같거나 작으면 몬스터가 화면 왼쪽끝에 도착한것
    // console.log(this.moveX + this.positionX + this.el.offsetWidth) ;
    this.el.style.transform = `translateX(${this.moveX}px)`;
    this.crash();
  }
  // 몬스터가 이동할때마다 히어로와 충돌했는지 확인
  crash() {
    let rightDiff = 30,
        leftDiff = 90;
    // 히어로의 오른쪽 위치와 몬스터의 왼쪽 위치 비교
    if(hero.position().right -  rightDiff > this.position().left && hero.position().left + leftDiff < this.position().right ) {
      console.log('충돌');
      hero.updateHp(this.crashDamage); 
    }
  }
}
