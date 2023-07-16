// Canvas setup
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;

let score = 0;
let gameFrame = 0;
ctx.font = '50px Georgia';

//Enum for lane position
const Lane = Object.freeze({
  Top: "Top",
  Center: "Center",
  Bottom: "Bottom"

});

//Touch interactivity

//Player
class Player {
  constructor() {
    this.width = 50;
    this.height = 100;
    this.x = canvas.width * 3 / 4;
    this.y = canvas.height / 2 + this.height / 2;
    this.frame = 0;
    this.frameX = 0;
    this.frameY = 0;
    this.lane = Lane.Center;
  }
  update() {
    //if touch interaction happens
    //case they swipe Bottom
    //if they are on the Bottom edge
    //then they run off the road and lose
    //else they move Bottom one position
    //case they swipe Top
    //if they are on the Top edge
    //then they run off the road and lose
    //else they move Top one position
  }
  draw() {
    //ctx.lineWidth = 0.2;
    //ctx.beginPath();
    //ctx.moveTo(this.x,this.y);
    //ctx.lineTo(this.x,this.y);
    //ctx.stroke();
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.width, this.height);
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
  constructor() {
    this.x = canvas.width;
    this.radius = 50;
    this.scale = 0.2;

    //Determine lane of pothole based on random integer between -1 and 1
    switch (Math.floor(Math.random() * 3) - 1) {
      case -1:
        this.lane = Lane.Top;
        this.y = canvas.height / 4;
        break;
      case 0:
        this.lane = Lane.Center;
        this.y = canvas.height / 2;
        break;
      case 1:
        this.lane = Lane.Bottom;
        this.y = canvas.height * 3 / 4;
        break;
      default:
        console.log('Error in lanes');
    }
    
    console.log(this.lane);

  }
  update() {
    //All potholes are move with same vertical speed and scale change
    //this.scale += 0.005;
    //this.y += 5 / 2;
    
    //Horizontal speed changes depending on lane to give perspective
    switch (this.lane) {
      case Lane.Top:
        this.x -= 3;
        break;
      case Lane.Center:
        this.x -= 3;
        break;
      case Lane.Bottom:
        this.x -= 3;
        break;
      default:
        console.log('Error in lanes');
    }
  }
  draw() {
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius*this.scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
  }
}

function handlePotHoles() {
  //Collision detection and pothole array management
  if (gameFrame % 50 == 0) {
    arrayPotHoles.push(new PotHole());
  }
  for (let i = 0; i < arrayPotHoles.length; i++) {
    arrayPotHoles[i].update();
    arrayPotHoles[i].draw();
  }
}

//Animation Loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  handlePotHoles();
  player.update();
  player.draw();
  gameFrame++;
  requestAnimationFrame(animate);
}
animate();
