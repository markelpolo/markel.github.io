// Canvas setup
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;

let score = 0;
let gameFrame = 0;
ctx.font = '50px Georgia';

//Touch interactivity

//Player
class Player {
  constructor(){
    this.x = canvas.width/2;
    this.y = canvas.height/2;
    this.radius = 50;
    this.angle = 0;
    this.frame = 0;
    this.frameX = 0;
    this.frameY = 0;
  }  
  update(){
    //if touch interaction happens
    //case they swipe right
    //if they are on the right edge
    //then they run off the road and lose
    //else they move right one position
    //case they swipe left
    //if they are on the left edge
    //then they run off the road and lose
    //else they move left one position
  }
  draw(){
    //ctx.lineWidth = 0.2;
    //ctx.beginPath();
    //ctx.moveTo(this.x,this.y);
    //ctx.lineTo(this.x,this.y);
    //ctx.stroke();
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.radius,0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    //ctx.stroke();
    //ctx.fillRect(this.x,this.y,this.radius,10);
  }
}
    
const player = new Player();
//Potholes
const arrayPotHoles = [];
class PotHole {
  constructor(){
    this.x = Math.random() * canvas.width;
    this.y = 0;
    this.radius = 50;
    this.speed = Math.random() * 5 + 1;
  }
  update(){
    this.y += this.speed;
  }
  draw(){
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
  }
}

function handlePotHoles(){
//Collision detection and pothole array management
  if (gameFrame % 50 == 0){
    arrayPotHoles.push(new PotHole());
    console.log(arrayPotHoles.length);
  }
  for (let i = 0; i < arrayPotHoles.length; i++){
    arrayPotHoles[i].update();
    arrayPotHoles[i].draw();
  }
}

//Animation Loop
function animate(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  handlePotHoles();
  player.update();
  player.draw();
  gameFrame++;
  requestAnimationFrame(animate);
}
animate();
