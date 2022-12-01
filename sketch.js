var PLAY = 1;
var END = 0;
var gameState = PLAY;

var steve, steve_running,steve_collided;
var ground,invisibleGround,groundImage;

var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5;
var nightbackground;

var cloudsGroup, cloudImage;
var monster, monster_running;

var score=0;
var jumpSound, collidedSound;

var YouDied, restart;

function preload(){
    jumpSound = loadSound("jump.wav")
    collidedSound = loadSound("collided.wav")

    backgroundImg = loadImage("nightbackground.png")

    steve_running = loadAnimation("steve_running2.png","steve_running3.png","steve_running1.png");
 steve_collided = loadAnimation("steve_collided.png")

 groundImage = loadImage("ground.png");
  
  cloudImage = loadImage("cloud.png");

  monster_running = loadImage("monster_running1.png","monster_running2.png","monster_running3.png");

 obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.jpg");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.jpg");
  obstacle5 = loadImage("obstacle5.png");

  YouDiedImg = loadImage("YouDied.jpg");
  restartImg = loadImage("restart.png");
}

function setup() {
    createCanvas(windowWidth, windowHeight); 

    steve = createSprite(500,height-70,20,100);

    steve.addAnimation("running", steve_running);
    steve.addAnimation("collided", steve_collided);
    steve.setCollider('circle',0,0,350);
    steve.scale = 0.2;
    monster =  createSprite(50,height-70,20,100);
    monster.addAnimation("running",monster_running);
    monster.scale = 1.0;
    invisibleGround = createSprite(width/2,height-10,width,125);  
  invisibleGround.shapeColor = "#f4cbaa";

  ground = createSprite(width/4,height,width,2);
  ground.addImage("ground",groundImage);
  ground.x = width/2
  ground.velocityX = -(6 + 3*score/100);
  

  YouDied = createSprite(width/2,height/2- 50);
  YouDied.addImage(YouDiedImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  YouDied.scale = 0.5;
  restart.scale = 0.1;

  YouDied.visible = false;
  restart.visible = false;

  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
    background(backgroundImg);
    textSize(20);
    fill("white")
    text("Score: "+ score,30,50);

   
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    
   
    if((touches.length > 0 || keyDown("SPACE")) && steve.y  >= height-250) {
      jumpSound.play( )
      steve.velocityY = -10;
      monster.velocityY = -10
      console.log("steve")
       touches = [];
    } 
    steve.velocityY = steve.velocityY + 0.8
    monster.velocityY = monster.velocityY + 0.8
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    steve.collide(invisibleGround);
    monster.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(steve)){
        collidedSound.play()
        gameState = END;
    }
  }
  else if (gameState === END) {
    YouDied.visible = true;
    restart.visible = true;

    ground.velocityX = 0;
    steve.velocityY = 0;
    monster.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    steve.changeAnimation("collided",steve_collided);

    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(touches.length>0 || keyDown("SPACE") || mousePressedOver(restart)) {      
        reset();
        touches = []
      }
  }
    
    
    drawSprites();
}

function spawnClouds() {
  
    if (frameCount % 60 === 0) {
      var cloud = createSprite(width+20,height-300,40,10);
      cloud.y = Math.round(random(100,220));
      cloud.addImage(cloudImage);
      cloud.scale = 0.5;
      cloud.velocityX = -3;
      
       
      
      cloud.lifetime = 300;
      
      
      cloud.depth = steve.depth;
      steve.depth = steve.depth+1;
      
      
      cloudsGroup.add(cloud);
    }}

    function spawnObstacles() {
        if(frameCount % 60 === 0) {
          var obstacle = createSprite(1500,height-95,20,30);
          obstacle.setCollider('circle',0,0,45)
         
        
          obstacle.velocityX = -(6 + 3*score/100);
          
         
          var rand = Math.round(random(1,2,5));
          switch(rand) {
            case 1: obstacle.addImage(obstacle1);
                    break;
                 case 2: obstacle.addImage(obstacle2);
                    break;
                    case 3: obstacle.addImage(obstacle3);
                           break;
                           case 4: obstacle.addImage(obstacle4);
                                   break;
                                   case 5: obstacle.addImage(obstacle5);
                                           break;
            default: break;
          }
          
           
          obstacle.scale = 0.3;
          obstacle.lifetime = 300;
          obstacle.depth = steve.depth;
          steve.depth +=1;
          
          obstaclesGroup.add(obstacle);
        }
      }
      
      function reset(){
        gameState = PLAY;
        YouDied.visible = false;
        restart.visible = false;
        
        obstaclesGroup.destroyEach();
        cloudsGroup.destroyEach();
        
        steve.changeAnimation("running",steve_running);
        monster.changeAnimation("running",monster_running);
        score = 0;
        
      }
      