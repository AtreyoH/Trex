var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var gameover,restart,gameover_image,restart_image;
var cloud, cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var obstacle;
var score;
var dieSound,checkSound,jumpSound;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  trex_jump=loadImage("trex1.png");
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  restart_image=loadImage("restart.png");
  gameover_image=loadImage("gameOver.png");
  jumpSound=loadSound("jump.mp3");
  dieSound=loadSound("die.mp3");
  checkSound=loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,170,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided);
  trex.addAnimation("jump",trex_jump);
  //trex.debug=true;
  trex.scale = 0.49;
   
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -10;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  gameover=createSprite(290,75,50,50);
  gameover.addImage(gameover_image);
  gameover.scale=0.75;
  restart=createSprite(300,110,10,10);
  restart.addImage(restart_image);
  restart.scale=0.5;
  // create Obstacles and Cloud groups
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  
 
   trex.setCollider("circle",0,0,40);
  trex.debug=false;
  score = 0;
  
  
} 
var msg="atreyo";
function draw() {
  background("white");
  textFont("Georgia");
  /*stroke("yellow");
  fill("red");*/
  textSize(20);
  text("Score: "+ score, 500,50);
  
  //console.log(msg);
   //console.log(gameState);
  if(gameState === PLAY){
    //move the ground
    gameover.visible=false;
    restart.visible=false;
    ground.velocityX = -(15+score/1000);
    score = score + Math.round(frameRate()/60);
    console.log("frame count "+frameCount);
    console.log("frame rate "+Math.round(frameRate()));
    if ((keyDown("space")||keyDown("up"))&&trex.collide(invisibleGround)) 
  {
    trex.velocityY = -19 ; 
    trex.changeAnimation("jump",trex_jump);
    jumpSound.play();
  }
  if(trex.isTouching(invisibleGround))
    {
      trex.changeAnimation("running",trex_running);
    }
  
  trex.velocityY = trex.velocityY + 2
  
  if (ground.x < 0){
    ground.x = ground.width/2;
  }
    //spawn the clouds
    spawnClouds();
    //spawn obstacles on the ground
    spawnObstacles();
    if(trex.isTouching(obstaclesGroup))
    {
      gameState=END;
      dieSound.play();
      trex.velocityY=0;
      trex.changeAnimation("jump",trex_jump);
    
    }
  if(score%100==0 && score>0)
  {
   checkSound.play(); 
  }
  }
  else if(gameState === END){
    //stop the ground
    gameover.visible=true;
    restart.visible=true;
    ground.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setVelocityXEach(0);
    cloudsGroup.setLifetimeEach(-1);
    trex.changeAnimation("collided" , trex_collided);
    if(mousePressedOver(restart))
    {
      reset();
    }
    
  }
  trex.collide(invisibleGround);
  
  drawSprites();
  //trex.collide(obstaclesGroup);
}

function spawnObstacles(){
  //var rand10=Math.round(random(50,60));
 if (frameCount % 30 === 0){
   obstacle = createSprite(600,165,10,40);
   obstacle.velocityX = ground.velocityX;
   
   
    // //generate random obstacles
    var rand = Math.round(random(1,6));
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
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 40;
   //obstacle.debug=true;
   //adding obstacles to the group
   obstaclesGroup.add(obstacle);
   obstacle.depth=trex.depth-1;
 }
}




function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 20 === 0) {
     cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = ground.velocityX;
    
     //assign lifetime to the variable
    cloud.lifetime = 190;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
  }
  
}
function reset()
{
  gameState=PLAY;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score=0;
}
