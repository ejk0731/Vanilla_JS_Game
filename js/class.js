class Hero {
  constructor(el) {
    this.el = document.querySelector(el);
    this.movex = 0;
    this.movey = 0;
    this.speed = 16;
    this.jumpy = -100;
    this.direction = 'right';
    // 점프 한번만 하도록 상태값 설정
    this.jumpStatus = false;
  }

  
  keyMotion() {
    
    if(key.keyDown['left']) {
      this.direction = 'left';
      this.el.classList.add('run');
      this.el.classList.add('flip');
      this.movex = this.movex - this.speed;
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

    // up 눌렀을 때 점프 (위->아래) 내려오는 모션
    // up 눌렀을 때 점프이미지로 되었다가 내려오면 이미지 초기화
    // up + left || up + right = x값 y값 둘다 변경

    if(key.keyDown['up']) {
      this.jumpStatus = true;
      this.el.animate(
        [
          {transform: `translate(${this.movex}px,${this.movey - 20}px)`}
        ],
        {
          duration: 100,
          iterations: 1,
          direction: 'alternate',
          easing: 'linear'
        }
      )
      // this.movey = this.movey - 20;
      this.el.classList.add('jump');
      // setTimeout(function() {
      //   this.movey = this.movey + 20;
      //   console.log('다시 내려와')
      // }, 100) 

      // 첫번째 방법 - 뭔가 부자연스러움
      // jumpstatus가 true면 animate
      // jumpstatus가 false면 
      // if(this.direction === 'left') {
      //   this.el.classList.add('left');
      //   console.log('왼쪽');
      // } else {
      //   this.el.classList.remove('left');
      // }
      // this.jumpStatus = true;
      // if(this.jumpStatus){

      //   this.el.classList.add('jump');
      //   console.log(this.movex);
     
      //   this.el.parentNode.animate(
      //     [
      //       {transform: `translate(${this.movex}px,${this.movey}px)`},
      //       {transform: `translate(${this.movex}px,${this.movey - 50}px)`},
      //       {transform: `translate(${this.movex}px,${this.movey - 150}px)`},
      //       {transform: `translate(${this.movex}px,${this.movey - 250}px)`},
      //       {transform: `translate(${this.movex}px,${this.movey - 150}px)`},
      //       {transform: `translate(${this.movex}px,${this.movey - 50}px)`},
      //       {transform: `translate(${this.movex}px,${this.movey}px)`}
            
      //     ],
      //     {
      //       duration: 500,
      //       iterations: 1,
      //       easing: 'linear'
      //     }
      //     );
          
      //   let heroJump = this.el;
      //   setTimeout(function() {
      //     heroJump.classList.remove('jump');  
      //     this.jumpStatus = false;
      //   }, 500)
      // }

      // 두번째 방법 - 성공!!이나 css의 영역
      // if(this.direction === 'left') {
      //   this.el.classList.add('left');
      //   console.log('왼쪽');
      // } else {
      //   this.el.classList.remove('left');
      // }
      // this.jumpStatus = true;
      // this.el.classList.add('jump');
    }


    // if(key.keyDown['down']) {
    //   this.movey = this.movey + 20;
    //   this.el.classList.add('jump');
    // }

    if(!key.keyDown['left'] && !key.keyDown['right']) {
      this.el.classList.remove('run');
    }
    if(!key.keyDown['attack']){
      this.el.classList.remove('attack');
      bulletComProp.launch = false; 
    }
    

    // !this.jumpStatus&&  
    this.el.parentNode.style.transform = `translate(${this.movex}px, ${this.movey}px)`;
  
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
    this.jumpHeight = false;
    this.init();
  }

  init() {
    // 수리검이 생성될때 히어로의 방향값을 수리검의 방향값으로 넣어주기
    this.bulletDirection = hero.direction === 'left' ? 'left' : 'right';
    this.jumpHeight = hero.jumpStatus === true ? true : false;
    this.x = hero.position().left + hero.size().width / 2;
    if(this.jumpHeight) {
      this.y = hero.position().bottom - hero.size().height
    } else {
      this.y = hero.position().bottom - hero.size().height / 2;
    }
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

  // 수리검이 화면 밖을 나가면 지워주기
  crashBullet() {
    if(this.position().left > gameProp.screenWidth || this.position().right < 0) {
      this.el.remove();
    }
  }

  
}
