// Canvas setup
const canvas = document.getElementbyId('canvas1');
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
    ctx.lineWidth = 0.2;
    ctx.beginPath();
    ctx.moveTo(this.x,this.y);
    ctx.lineTo(this.x,this.y);
    ctx.stroke();
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.radius,0.Math.PI*2);
    ctx.fill();
    ctx.closePath();
    ctx.fillRect(this.x,this.y,this.radius,10
}
    
const player = new Player();
//Potholes

//Animation Loop
function animate(){
  player.update();
  player.draw();
  requestAnimationFrame(animate);
}
animate();
