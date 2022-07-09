//JS 코드 시작
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
//Audio객체를 만들어 변수에 저장, 경로설정
var shootAudio = new Audio();
var crashAudio = new Audio();
crashAudio.src="./sound/crash.mp3";
shootAudio.src="./sound/Shot.mp3";
shootAudio.volume=0.5;

//img 객체를 만들어 변수에 저장,경로설정
var crashImg = new Image();
crashImg.src="./img/crash.png";
var attackImg= new Image();
attackImg.src="./img/attack.png";

//비어있는 폭발list 선언
let explosionList = [];
let explosionList2=[];

let musicPlayer = document.querySelector('#musicPlayer');  //id값이 musicPlayer인 선택자를 musicPlayer 변수 대입
var canvas = document.getElementById('gameCanvas');  // canvas 변수에 문서안에 있는 id값이 gameCanvas 값을 대입함. 
var ctx = canvas.getContext('2d');

// 방향키,스페이스바의 기본 boolean값 설정
var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;
var spacePressed = false;


var timer=0; //타이머
var score=0; //점수를 출력할 변수.
var count=0; //적기를 잡은수
var highscore=0; //최고점수
var gamelevel=1; //게임라운드(레벨)
var temp2=0; //score를 담을 임시 보관함
var temp=0; //score 수식 대입

//비행기에 대한 정보
var shipSize = 50; //shipsize라는 변수에 40 대입
var shipImg = new Image(); //새로운 객체 만들어서 shipImg변수에 대입
shipImg.src = "./img/ship.png"; // 
var ship = { 
    x : (canvas.width - shipSize)/2, // x,y좌표 가로,세로 크기를 설정.
    y : canvas.height - shipSize,
    w : shipSize,
    h : shipSize
};



//적(장애물)에 대한 정보 
var enemy1Size = 40;
var enemy1Img = new Image();
enemy1Img.src = "./img/enemy.png";
var enemy1Count = 10;
var enemy1Status = []; //빈 enemy1Status배열을 만들어줌
for (var i = 0; i < enemy1Count; i++) { //enemy1Status[0]~[9]에 초기 key:value값을 넣어줌
    enemy1Status[i] = { 
    x : 0, 
    y : 0, 
    w : enemy1Size, 
    h : enemy1Size,
    img : enemy1Img,
    status: 0
    };
}


//적기2에 대한 정보
var enemy2Size = 40;
var enemy2Img = new Image();
enemy2Img.src = "./img/enemy2.png";
var enemy2Count = 15;
var enemy2Status = []; //빈 enemy2Status배열을 만들어줌
for (var i = 0; i < enemy2Count; i++) { //enemy1Status[0]~[9]에 초기 key:value값을 넣어줌
    enemy2Status[i] = { 
    x : 0, 
    y : 0, 
    w : enemy2Size, 
    h : enemy2Size,
    img : enemy2Img,
    status: 0,
    xDirection : 1,
    yDirection : 1
    };
}

//미사일에 대한 정보
var missileSize = 50;
var missileImg = new Image();
missileImg.src = "./img/missile.png";
var missileCount=1000; 
var missileStatus = [];  //빈 missileStatus 배열을 만들어줌
for(var j=0; j < missileCount; j++) { //missileStatus[0]~[999]에 초기 key:value값을 넣어줌

    missileStatus[j]={
        x: 0,
        y: 0,
        w:missileSize,
        h:missileSize,
        img : missileImg,
        status:0
    };
} 

//생명력에 대한 정보
var lifeSize = 100;
var lifeImg = new Image();
lifeImg.src = './img/heart.png';
var lifeCount=3;
var lifeStatus=[]; //빈 배열을 만들어줌
for(var i=0; i<lifeCount; i++) //lifeStatus.[0]~[2]에 초기 key:value값을 넣어줌
{
    lifeStatus[i] = {
    x:0,
    y:0,
    w : lifeSize,
    h : lifeSize,
    status:0,
    img : lifeImg
    };
}


//상하좌우 스페이스바를 눌렀을 경우 해당 key값을 false로 바꿔주는 함수
function keyDownHandler(e) { 
    if(e.code == 'ArrowRight') {
        rightPressed = true;
    } 
    else if(e.code == 'ArrowLeft') {
        leftPressed = true;
    }
    else if(e.code == 'ArrowUp') {
        upPressed = true;
    }
    else if(e.code == 'ArrowDown') {
        downPressed = true;
    }
    else if(e.code === 'Space' )
    {
        spacePressed=true;
    }
}

//상하좌우 스페이스바에 손을 땟을때 해당 key값을 false로 바꿔주는 함수
function keyUpHandler(e) { 
    if(e.code == 'ArrowRight') {
        rightPressed = false;
    }       

    else if(e.code == 'ArrowLeft') {
        leftPressed = false;
    }

    else if(e.code == 'ArrowUp') {
        upPressed = false;
    }

    else if(e.code == 'ArrowDown') { 
        downPressed = false; 
    }

    else if(e.code === 'Space' )
    {
        spacePressed=false;
    }
}


  
// 새로운 적기를 랜덤하게 1대 생성하는 코드.
function createNewEnemy(probWeight, gameLevel) { 

    //Math.random()에 가중치를 곱하여 적기가 랜덤하게 생성되게 하는 조건
    if(Math.floor(Math.random() * probWeight) < gameLevel) {

        for(var i = 0; i < enemy1Count; i++) {

            var enemy = enemy1Status[i];

            if(enemy.status == 0) { //enemy.status가 0인경우 y좌표는 0 x좌표는 랜덤하게 설정
                enemy.y = 0;
                enemy.x = Math.floor(Math.random() * canvas.width);

                // enemy가 canvas밖에 출력되는 경우 x좌표를 캔버스너비에서-크기를 뺀 위치에 재설정
                    if(enemy.x + enemy1Size > canvas.width) { 
                        enemy.x = canvas.width - enemy1Size; 
                    }
                enemy.status = 1; 
            }
        }
        //위의 enemy1의 코드설명과 동일
        for(var i=0; i< enemy2Count; i++)
        {
        var enemy2= enemy2Status[i];

            if(enemy2.status == 0) {
                enemy2.y = 0;
                enemy2.x = Math.floor(Math.random() * canvas.width);

                    if(enemy2.x + enemy2Size > canvas.width) { //enemy가 canvas를 벗어나지 못하도록 범위 설정.
                        enemy2.x = canvas.width - enemy2Size;
                    }
                enemy2.status = 1; 
                break; 
            }
        }
    }
}

// 하트아이템을 랜덤하게 만들어주는 코드
function createHeartItem(probWeight, gameLevel) { 
    
    if(lifeCount<3) { // life값이 3미만일경우만 하트아이템 출력 
        //enemy를 출력하는 코드와 비슷, 가중치를 주어 하트아이템이 랜덤하게 생성
        if(Math.floor(Math.random() * probWeight) < gameLevel) {

            for(var i = 0; i < lifeCount; i++) {
                var life = lifeStatus[i];

                if(life.status == 0) {
                    life.y = 0;
                    life.x = Math.floor(Math.random() * canvas.width); //Life의 초기 x좌표를 랜덤하게 설정
            
                        if(life.x + lifeSize > canvas.width) { //LIFE의 랜덤x좌표가 canvas를 벗어나는 경우 x좌표 재설정
                            life.x = life.width - lifeSize;
                        }
                    life.status = 1; 
                    break;
                    }
            }
        }      
    }
}

//미사일 생성함수(스페이스바 누르면 미사일객체 생성)
function createNewMissile() {

    if(spacePressed){
     
        timer++;
        //미사일 연사시 생기는 문제해결하기위해 timer값으로 delay를 걸어 조건문 설정
        if(timer%7==0)
        {
            //미사일 배열을 객체에 넣어주는 코드
            for(var i = 0; i < missileCount; i++) {
            var missile = missileStatus[i];

                if(missile.status == 0) { //x,y,status값 설정
                    missile.y = ship.y+shipSize-missileSize;
                    missile.x = ship.x; 
                    missile.status = 1; 
                    break; 
                }
            }
        }        
    }   
}

 //모든 적기를 그리는 함수
function drawAllEnemies() {

        for(var i = 0; i < enemy1Count; i++) { //enemy1의 갯수만큼 반복문진행
            var enemy1 = enemy1Status[i]; // enemy1Status[i]정보를 담은 enemy1객체 생성

            if (enemy1.status == 0) {
                continue;
            }
            enemy1.y += 2; //기본 enemy의 y 좌표이동값 설정.
            
            //gamelevel값에 따라 enemy의 y좌표 즉 속도 설정
            if(gamelevel>1) {
                enemy1.y +=5;
            }
            if(enemy1.y + enemy1Size <= canvas.height) {  //enemy1의 y좌표가 canvas내에 있으면 canvas에 출력

                ctx.drawImage(enemy1.img, enemy1.x, enemy1.y, enemy1.w, enemy1.h);
    
            }

            else { //enemy가 canvas 바깥으로 가면 status를 0으로 바꿔 죽은 enemy라고 인식하도록 해줌.
                enemy1.status = 0;
            }
         }
        //gamelevel이 2가 되면 새로운 적기 출현 조건문
        if(gamelevel>1) { 

            for(var i = 0; i < enemy2Count; i++) { //enemy2의 갯수만큼 반복문 진행
                var enemy2 = enemy2Status[i]; // enemy2Status[i]정보를 담은 enemy2객체 생성

                // 적이 죽어있으면 생략
                if(enemy2.status == 0) {
                    continue;
                }

                // 캐릭터가 캔버스 밖으로 나가는지 확인, 나가면 방향 전환
                if (enemy2.y + (enemy2Size / 2) > canvas.height){         // 하방 확인
                    enemy2.yDirection = -1;                             // Y축 방향 전환
                } else if (enemy2.y + (enemy2Size / 2) < 0) {             // 상방 확인
                    enemy2.yDirection = 1;
                } else if (enemy2.x + (enemy2Size / 2) > canvas.width){   // 좌방 확인
                    enemy2.xDirection = -1;                             // X축 방향 전환
                } else if(enemy2.x + (enemy2Size / 2) < 0){               // 우방 확인
                    enemy2.xDirection = 1;
                }
                //게임레벨에따라 enemy2 속도설정
                if(gamelevel>1) {

                    enemy2.x += 3 * Math.random() * enemy2.xDirection;  // 적기 이동
                    enemy2.y += 4 * enemy2.yDirection;
                }
                if(gamelevel>2) {

                    enemy2.x += 7 * Math.random() * enemy2.xDirection;  // 적기 이동
                    enemy2.y += 6 * enemy2.yDirection;
                }
               
                // enemy2를 canvas에 출력
                ctx.drawImage(enemy2.img, enemy2.x, enemy2.y, enemy2.w, enemy2.h);
            }
        }
    createNewEnemy(30, 2);    
}

  
//미사일 그리는 함수
function drawAllMissile() {
        for(var i = 0; i < missileCount; i++) {

        //미사일배열[0]~[9]을 missile객체에 대입 후 조건 설정.
        var missile = missileStatus[i];
        
        //status가 0 즉 캔버스위에없다고 판단되면 계속 진행해라.
        if (missile.status == 0) {
            continue;
        }
        //missile객체의 y좌표이동값 설정
 

        //missile이 캔버스 위에 있을 경우 
        if(missile.y + missileSize >= 0) {

            shootAudio.play();   
            ctx.drawImage(missile.img, missile.x, missile.y, missile.w, missile.h);
            missile.y-=3;
            if(gamelevel>1) //gamelevel 이 올라가면 미사일을 하나더 추가하며 발사속도상승.
            {
            ctx.drawImage(missile.img, missile.x-15, missile.y, missile.w, missile.h);
            missile.y-=5;
            }

        }

        //missile이 캔버스 밖으로 나갔을 경우
        else { 
            missile.status = 0; //status값을 0으로 설정하여 사라지도록 해줌.
        }
    } 
    createNewMissile();
}

// 먹으면 생명력을 올려주는 HeartItem 출력 코드
function DropHeratItem() {

        for(var i = 0; i < lifeCount; i++) {
            var life = lifeStatus[i];

            if (life.status == 0) {
                continue;
            }

            life.y += 2;

            if(life.y + lifeSize <= canvas.height) {
                ctx.drawImage(life.img, life.x, life.y, 30, 30);
            }

            else { //enemy가 canvas 바깥으로 가면 status를 0으로 바꿔 죽은 enemy라고 인식하도록 해줌.
                life.status = 0;
            }
        }
    createHeartItem(450, 2);    
}


// ship 과 missile이 enemy가 부딪혔는지 확인. 사각형과 사각형이 조금이라도 만났을때 부딪혔다고 인식하도록 만드는 코드. 
function checkCrash() {
    for(var i = 0; i < enemy1Count; i++) {
        //enemyStatus배열의 정보를 담고있는 enemy1,enemy2 객체 생성
        var enemy1 = enemy1Status[i]; 
        var enemy2 = enemy2Status[i];

            // 적군이 한명도없다면 if문을 무시하고 진행해라. 
            if(enemy1.status == 0) { 
                continue;
            } 

            if(enemy2.status==0){
                continue;
            }

            ship.rx = ship.x + ship.w;
            ship.by = ship.y + ship.h;
            enemy1.rx = enemy1.x + enemy1.w;
            enemy1.by = enemy1.y + enemy1.h;
            enemy2.rx = enemy2.x + enemy2.w;
            enemy2.by = enemy2.y + enemy2.h;

            //ship과 enemy1이 부딪혔을 경우
            if((ship.x >= enemy1.x && ship.x <= enemy1.rx) || (ship.rx >= enemy1.x && ship.rx <= enemy1.rx)) {

                if((ship.y >= enemy1.y && ship.y <= enemy1.by) || (ship.by >= enemy1.y && ship.by <= enemy1.by)) {
                    
                    crashAudio.play(); //효과음 발생
                    explosionList.push({ //push를 이용하여 explosionlist에 해당정보 삽입
                        status: 10,  // 폭발 단계
                        x: ship.x,
                        y: ship.y
                    });

                    enemy1.status=0;  //적기랑 부딪히는 순간 적기를 죽은걸로 판단하며 생명력을 1감소하는 코드
                    lifeCount--;
                }
            }
            //ship과 enemy2가 부딪혔을경우
            if((ship.x >= enemy2.x && ship.x <= enemy2.rx) || (ship.rx >= enemy2.x && ship.rx <= enemy2.rx)) {

                if((ship.y >= enemy2.y && ship.y <= enemy2.by) || (ship.by >= enemy2.y && ship.by <= enemy2.by)) {
                    
                    crashAudio.play(); //효과음 발생
                    explosionList.push({ //push를 이용하여 explosionlist에 해당정보 삽입
                        status: 10,  // 폭발 단계
                        x: ship.x,
                        y: ship.y
                    });

                    enemy2.status=0;  //적기랑 부딪히는 순간 적기를 죽은걸로 판단하며 생명력을 1감소하는 코드
                    lifeCount--;
                }
            }
        }
    return 0; 
}

//아군 비행기가 하트가 부딪혔을경우 생명력1증가하는 함수
function IncreaseLife() {

    if(lifeCount<3){

    for(var i = 0; i < lifeCount; i++) {
        //lifeStatus배열값을 담고있는 life 객체 생성
        var life = lifeStatus[i];

            if(life.status == 0) {
                continue;
            } 

            ship.rx = ship.x + ship.w;
            ship.by = ship.y + ship.h;
            life.rx = life.x + life.w;
            life.by = life.y + life.h;

            //ship과 life가 부딪혔을 경우 
            if((ship.x >= life.x && ship.x <= life.rx) || (ship.rx >= life.x && ship.rx <= life.rx)) {

                if((ship.y >= life.y && ship.y <= life.by) || (ship.by >= life.y && ship.by <= life.by)) {

                    life.status=0;  //life.status을 0으로 바꿔 사라지게만듬.
                    lifeCount+=1; //lifcount에 1을 더해줌
                    return 1; 
                }
            }
       }
    }
    return 0;
}


// 메인 루프에서 호출, 충돌 이미지 자료구조 참조해서 아군 비행기 충돌 이미지 캔버스에 표시
function drawshipExplosion () {
    // 처리해야할 충돌이 있으면
    if(explosionList.length > 0) {
        explosionList.forEach((explosion, index, arr) => {
            ctx.drawImage(crashImg,explosion.x-50,explosion.y-40,150,150);
            explosion.status--;
            if (explosion.status == 0) {
                arr.splice(index, 1);
            }
        });
    }
}


// 메인 루프에서 호출, 적기와 미사일 폭발 이미지 자료구조 참조해서 적기 폭발이미지 캔버스에 표시
function drawenempyExplosion () {
    // 처리해야할 폭발이 있으면
    if(explosionList2.length > 0) {
        explosionList2.forEach((explosion2, index, arr) => {
            ctx.drawImage(attackImg,explosion2.x-50,explosion2.y-40,150,150);
            explosion2.status--;
            if (explosion2.status == 0) {
                arr.splice(index, 1);
            }
        });
    }
}


//공격이 성공했는지 체크하는 함수  
function attackcheck()  {
    
    //enemy1에 대한 충돌 검사
    for(var i = 0; i < enemy1Count; i++) { 
        //enemyStatus배열의 정보를 담고있는 enemy1,enemy2 객체 생성
        var enemy = enemy1Status[i];
        var enemy2 = enemy2Status[i];

            if(enemy.status == 0) { // 적군이 한명도없다면 if문 아래를무시하고 진행해라. 
                continue;
            }

            enemy.rx = enemy.x + enemy.w;
            enemy.by = enemy.y + enemy.h;

            for( var j=0; j<missileCount; j++)
            {
                //missileStatus배열의 정보를 담고있는 missile 객체 생성
                var missile=missileStatus[j];

                if(missile.status==0)
                {
                    continue;
                }

                missile.rx=missile.x+missile.w;
                missile.by=missile.y+missile.h;

                //enemy1과 missile이 충돌했을 경우의 조건
                if((missile.x >= enemy.x && missile.x <= enemy.rx) || (missile.rx >= enemy.x && missile.rx <= enemy.rx)) {

                    if((missile.y >= enemy.y && missile.y <= enemy.by) || (missile.by >= enemy.y && missile.by <= enemy.by)){
                
                                count+=1; //적기를 잡은 횟수
                                missile.status=0; //적기랑 부딪혔을때 미사일과 적기의 상태를 0으로바꿔 화면에서 사라지게 즉 죽은상태로 보여줌
                                enemy.status=0;
                                score+=100; //성공시 스코어에 +100/10 즉 10만큼 점수가 오름 
                                explosionList2.push({
                                    status: 10,  // 폭발 단계
                                    x: missile.x,
                                    y: missile.y
                                });
                              return 1; //return값이 1이면 부딪혔단 소리 0이면 아무 enemy하고 부딪히지않았단사실.
                            }
                }
            }
    }
    //enemy2에 대한 충돌 검사
    for(var i = 0; i < enemy2Count; i++) { 
        var enemy2 = enemy2Status[i];

            if(enemy2.status==0){
                continue;
            }

            enemy2.rx = enemy2.x + enemy2.w;
            enemy2.by = enemy2.y + enemy2.h;

            for( var j=0; j<missileCount; j++)
            {
                var missile=missileStatus[j];

                if(missile.status==0)
                {
                    continue;
                }

                missile.rx=missile.x+missile.w;
                missile.by=missile.y+missile.h;

                //enemy2와 missile 부딪혔을 경우에 대한 조건
                if((missile.x >= enemy2.x && missile.x <= enemy2.rx) || (missile.rx >= enemy2.x && missile.rx <= enemy2.rx)) {

                    if((missile.y >= enemy2.y && missile.y <= enemy2.by) || (missile.by >= enemy2.y && missile.by <= enemy2.by))
                        {
                            count+=1; //적기를 잡은 횟수
                            missile.status=0; //적기랑 부딪혔을때 미사일과 적기의 상태를 0으로바꿔 화면에서 사라지게 즉 죽은상태로 보여줌
                            enemy2.status=0;
                            score+=500; //성공시 스코어에 500/10 즉 50만큼 점수가 오름 
                            explosionList2.push({
                                status: 10,  // 폭발 단계 
                                x: missile.x,
                                y: missile.y
                            });      
                            return 1; //return값이 1이면 부딪혔단 소리 0이면 아무 enemy하고 부딪히지않았단사실.
                        }
                }
            }
    }
    return 0;
}

//스코어 체크하는 함수
function CheckScore() {
    if(lifeCount>0)
    {
    score++;
    temp2=parseInt(score/10);
    ctx.fillText("Score : "+ temp2 , 1000,30);
    ctx.font = "25px sans-serif";
    ctx.fillStyle="white";


    //temp와temp2를 비교하여 최고값 비교 후 출력
    if(temp<temp2){
    temp=temp2;
    ctx.fillText("최고 점수 : "+ temp,30,30);
    }
    else
    ctx.fillText("최고 점수 : "+ temp,30,30);
    }
}


//생명력 그려주는 함수
function drawLife() { 
    if (lifeCount === 1) {
        ctx.drawImage(lifeImg, 1000, 35, 30, 30);
    } else if (lifeCount === 2) {
        ctx.drawImage(lifeImg, 1000, 35, 30, 30);
        ctx.drawImage(lifeImg, 1035, 35, 30, 30);
    } else if (lifeCount === 3) {
        ctx.drawImage(lifeImg, 1000, 35, 30, 30);
        ctx.drawImage(lifeImg, 1035, 35, 30, 30);
        ctx.drawImage(lifeImg, 1070, 35, 30, 30);
    }
}


//게임 설명서 함수
function ExplainGame() {

    //게임 설명서 버튼과 연동하여 사용
    if(document.querySelector('#explanation').value=="OPen Game explanation") {
        document.querySelector('#explanation').value="Close Game explanation";
       
        // 게임에 대한 설명
        ctx.font = "25px sans-serif";
        ctx.fillStyle="white";
        ctx.fillText("빠르게 내려오는 적기를 잡아서 점수를 획득하는 게임입니다.",250,100);
        ctx.fillText("방향키를 통해 아군 발사체를 조종할 수있습니다.",250,150);
        ctx.fillText("스페이스바를 누르면 미사일이 나갑니다.",250,200);
        ctx.fillText("총 생명은 3개이며 적기와 부딪힐경우 생명력이 감소됩니다.",250,250);
        ctx.fillText("라운드가 높아질수록 적군이 많아지며 속도가 빨라집니다.",250,300);
        ctx.fillText("배경음악을 끄고싶으시다면 BGM Puase버튼을 눌러주세요.",250,350);
        ctx.fillText("게임시작을 원하시면 밑의 GameStart버튼을 눌러주세요.",250,400);
        ctx.fillText("게임시작을 일시정지하고싶으시면 밑의 GamePause버튼을 눌러주세요.",250,450);
        ctx.fillText("모든 적기를 잡아 우주의 평화를 지켜주세요.",250,500);
    }
     //설명서를 종료한 경우
    else {
        document.querySelector('#explanation').value="OPen Game explanation";
        ctx.clearRect(0, 0, canvas.width, canvas.height);   
    }   
}


//배경 음악 정지,재생 코드,Bgm play 버튼과 연동
function playbgm() {

    if(musicPlayer.paused===true){
        document.querySelector('#Musicbtn').value='BGM Pause';
        musicPlayer.play();
    }   
    
    else
    {
        document.querySelector('#Musicbtn').value='BGM Play';
        musicPlayer.pause();
    }
}

//게임시작 함수. gamestart 버튼과 연동
function StartGame() {
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 3;
    ctx.shadowColor = "rgba(256, 0, 0, 100)";
    document.querySelector('#gamePause').disabled=false;
    document.querySelector('#gameStart').disabled=true;
    musicPlayer.play();
    draw();
}

//게임을 다시시작시키는 함수. gameResume 버튼과 연동
function Resumegame() {

    //각 기본변수들의 값을 초기값으로 다시 설정.
    musicPlayer.play();
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 3;
    ctx.shadowColor = "rgba(256, 0, 0, 100)";
    lifeCount=3;
    ship.x = (canvas.width - shipSize)/2; 
    ship.y = canvas.height - shipSize;
    score=0;
    count=0;
    gamelevel=1;

    // enemy,life,missile 배열의 key:value값을 초기화
    for (var i = 0; i < enemy1Count; i++) {
        enemy1Status[i] = {
        x : 0, 
        y : 0, 
        w : enemy1Size, 
        h : enemy1Size,
        img : enemy1Img,
        status: 0
        };
    }

    for (var i = 0; i < enemy2Count; i++) {
        enemy2Status[i] = {
        x : 0, 
        y : 0, 
        w : enemy2Size, 
        h : enemy2Size,
        img : enemy2Img,
        status : 0,
        xDirection : 1,
        yDirection : 1
        };
    }

        for(var i=0; i<lifeCount; i++)
        {
            lifeStatus[i] = {
            x:0,
            y:0,
            w : lifeSize,
            h : lifeSize,
            status:0,
            img : lifeImg
            };
        }

        for(var j=0; j < missileCount; j++)
        {
            missileStatus[j]={
            x: 0,
            y: 0,
            w:missileSize,
            h:missileSize,
            img : missileImg,
            status:0
            };
} 

    myReq; //draw()함수를 다시불러옴

}

//일시정지 기능. myReq에 담겨있는 requestAnmationFrame(draw)를 취소해주는 역할을 하여 일시정지 된것처럼 보여준다.
function PauseGame() {
    
    cancelAnimationFrame(myReq); 
    document.querySelector('#gameStart').disabled=false; //gameStart버튼을 활성화
    document.querySelector('#gamePause').disabled=true; //gamePause 버튼을 비활성화
}


// 라운드 증가 및 출력 기능
function checkRound() {

    if(count<70){
    ctx.fillText("라운드 : "+ gamelevel,30,70);
    return 0;
    }
    else if(count<150) {
        gamelevel=2;
        ctx.fillText("라운드 : "+ gamelevel,30,70);
        return 0;
    }
    else {
        gamelevel=3;
        ctx.fillText("라운드 : "+ gamelevel,30,70);
        return 1;
    }
    return 0;
}

// 게임이끝났을떄 실행될 함수
function GameOver() {

    if(lifeCount <= 0) { //life값이 0 즉 gameover시에만 밑의 함수 실행

        //함수및 캔버스 초기화
        cancelAnimationFrame(myReq);  //myReq에 해당하는 애니메이션을 취소한다.
        ctx.clearRect(0, 0, canvas.width, canvas.height); //캔버스위에 남아있는것을 다 지움.

        // 배경음악.효과음 종료
        musicPlayer.pause();  
        crashAudio.pause(); 
        shootAudio.pause();

        //버튼 활성화 비활성화
        document.querySelector('#gamePause').disabled=true; //gamePause버튼 비활성화
        document.querySelector('#gameResume').disabled=false; //LIFE값이 0이하인경우에만 gameResume버튼을 활성화시킴
        

        // ctx.fillText문구에 그림자를 넣어주는 기능
        ctx.shadowOffsetX = 3; 
        ctx.shadowOffsetY = 3;
        ctx.shadowBlur = 3;
        
        // 게임이 끝났을때 나올 문구에 대한 정보 
        ctx.font = "45px sans-serif";
        ctx.fillText( user+ "의 최종 스코어 : " + temp2 +"점", 330,150);
        ctx.fillText("Game Over", 460,240);
        ctx.fillText("재시작을 원하시면 Game Resume버튼을 눌러주세요.", 70,330);
    }
  
    else{ //LIFE값이 0이 되기전에는 gameResume버튼을 비활성화, gamePause버튼만 활성화.
    document.querySelector('#gamePause').disabled=false;
    document.querySelector('#gameResume').disabled=true;
    } 
}


//위에서 만든 모든함수를 넣고 통합하여 사용하는 Draw 함수 
function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);   // 캔버스 초기화

    // 플레이어 표시, 충돌 확인 후 라이프 감소
    ctx.drawImage(shipImg, ship.x, ship.y, ship.w, ship.h);     // 사용자 비행기 표시
    CheckScore();    // 스코어 값 체크 + 최대 점수 출력
    ctx.fillText("잡은 몬스터 수 : "+ count, 720,30); // 잡은 몬스터 수 출력
    checkCrash();       // 적과 충돌했는지 확인
    drawshipExplosion();    // 베 충돌 이펙트 출력
    drawLife();     // 생명력 하트 표시

    checkRound();       // 라운드 체크
    drawAllEnemies(); //적기 표시
    drawAllMissile(); // 공격 버튼 누르고 있을 때 미사일 추가, 미사일 표시
    DropHeratItem(); //랜덤하게 하트를 떨어드린다.
    IncreaseLife(); //하트아이템 먹을시 생명력 증가.
    attackcheck(); // 공격이 성공했는지 체크
    drawenempyExplosion(); // 공격이펙트 출력
  

    // 사망 시 게임 종료
    GameOver();     // 게임 종료 루틴

    // 플레이어(비행기) 이동
    if(rightPressed && ship.x < canvas.width - shipSize) { //오른쪽 방향키 눌렀을 경우
        ship.x += 5; //ship을 오른쪽으로 움직이는 칸의 갯수 즉 속도 조절.
    } 
    else if (leftPressed && ship.x > 0) { //왼쪽방향키를 눌렀을 경우
        ship.x -= 5;
    }
    if (upPressed && ship.y > 0) { //윗 방향키를 눌렀을 경우
        ship.y -= 3;
    }
    else if(downPressed && ship.y < canvas.height - shipSize) { //아랫 방향키를 눌렀을 경우 
        ship.y += 3; 
    }
    
    myReq=requestAnimationFrame(draw); //myReq에 대입(반복적으로 draw함수가 반복적으로 호출되도록 함으로써 무한반복 된다).
}