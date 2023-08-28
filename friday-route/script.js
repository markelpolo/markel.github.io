//Import custom classes
//import Player from "/src/player"
//import InputHandler from "/src/input"


// Canvas setup
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

/*
if window.innerWidth >= window.innerHeight{
  window_dim = window.innerHeight;
}else { 
  window_dim = window.innerWidth;
}
*/
window_dim = 600;

canvas.width = window_dim;
canvas.height = window_dim;

let score = 0; //The number of packages avoided.
let gameFrame = 0; //The number of frames in the game.
let groundY = 150;//The ground distance from the canvas height.
let startingX = 150;
ctx.font = '50px Georgia';

//Enum for lane position
const Lane = Object.freeze({
  Top: "Top",
  Center: "Center",
  Bottom: "Bottom"

});

//Player
class Player {
  constructor(x, y) {
    this.offsetX = x;
    this.offsetY = y;
    this.w_stand = 100;
    this.w_crouch = 150;
    this.h_stand = 150;
    this.h_crouch = 100;
    this.width = this.w_stand;
    this.height = this.h_stand;
    this.x = this.offsetX - this.width/2;
    this.y = this.offsetY - this.height;
    this.vx = 0;
    this.vy = 0;
    this.frame = 0;
    this.frameX = 0;
    this.frameY = 0;
    this.lane = Lane.Center;
    this.crouch = false;
    this.airborne = false;
    this.speed = -14;
    this.gravity = 0.4;
  }
  update() {
    //If you are off the ground, your velocity will change
    this.y += this.vy

    if ((this.offsetY - this.height) > this.y){
      this.vy += this.gravity;
    } else {
      this.airborne = false;
      this.resetPosition();
    }

  }
  draw() {
    //ctx.lineWidth = 0.2;
    //ctx.beginPath();
    //ctx.moveTo(this.x,this.y);
    //ctx.lineTo(this.x,this.y);
    //ctx.stroke();
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fill();
    ctx.closePath();
    //ctx.stroke();
    //ctx.fillRect(this.x,this.y,this.radius,10);
  }
  up(){
    if (this.crouch) {
        this.crouch = false;
        this.width = this.w_stand;
        this.height = this.h_stand;
        this.resetPosition();
    } else if (!this.airborne){
      this.airborne = true;
      this.vy = this.speed;
    }
  }
  down(){
    if (!this.crouch && !this.airborne) {
      this.crouch = true;
      this.width = this.w_crouch;
      this.height = this.h_crouch;
      this.resetPosition();
    }
  }
  resetPosition(){
    this.x = this.offsetX - this.width/2;
    this.y = this.offsetY - this.height;
  }
}
const player = new Player(startingX, canvas.height - groundY);

//Touch interactivity
class InputHandler {

  constructor(player){
    
    this.y_start = 0;
    this.y_end = 0;

    document.addEventListener('keydown', event => {
        switch (event.key) {
          case "ArrowDown":
            player.down();
            break;

          case "ArrowUp":
            player.up();
            break;

        }
    });

    document.addEventListener('touchstart', event => {
      this.y_start = event.changedTouches[0].screenY
      console.log(this.y_start)
    });

    document.addEventListener('touchend', event => {
      this.y_end = event.changedTouches[0].screenY
      console.log(this.y_end)
      //Test to see whether the finger swiped up or down past an error threshold.
      let y_diff = this.y_start - this.y_end;
      let y_err = 5;

      if (y_diff > y_err) {player.up();}
      else if(y_diff < -y_err) {player.down();}
      else {console.log("no move")}
    });

    
  }


}

new InputHandler(player);



//Packages
const arrayPackages = [];
class Package {
  constructor(start,end,floor) {
    this.start = start;
    this.end = end; 
    this.floor = floor;
    this.height = 20;
    this.width = 40;
    this.spacing = 75;
    this.x = this.start;
    //this.scale = 0.2;

    //Determine lane of Package based on random integer between -1 and 1
    switch (Math.floor(Math.random() * 2) - 1) {
      case -1:
        this.lane = Lane.Bottom;
        this.y = this.floor - this.spacing;
        break;
      case 0:
        this.lane = Lane.Center;
        this.y = this.floor - this.spacing * 2;
        break;
      case 1:
        this.lane = Lane.Top;
        this.y = this.floor - this.spacing * 3;
        break;
      default:
        console.log('Error in lanes');
    }

    //Determine speed of Package based on random integer between -1 and 1
    switch (Math.floor(Math.random() * 3) - 1) {
      case -1:
        this.speed = -4
        break;
      case 0:
        this.speed = -4
        break;
      case 1:
        this.speed = -4
        break;
      default:
        console.log('Error in lanes');
    }
    
    console.log(this.lane);

  }
  update() {
    //All Packages are move with same vertical speed and scale change
    //this.scale += 0.005;
    //this.y += 5 / 2;
    this.x += this.speed;
    
    //Horizontal speed changes depending on lane to give perspective
    /*
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
    */
  }
  draw() {
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    //ctx.arc(this.x, this.y, this.radius*this.scale, 0, Math.PI * 2);
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    //ctx.fill();
    ctx.closePath();
    ctx.stroke();
  }
}

function handlePackages() {
  //Collision detection and Package array management
  if (gameFrame % 120 == 0) {
    arrayPackages.push(new Package(canvas.width, 0, canvas.height - groundY));
  }

  //Collect a list of indices of packages outside of the frame of view
  let idx = [];

  for (let i = 0; i < arrayPackages.length; i++) {
    
    pack_i = arrayPackages[i];

    //Update the position of all the packages
    pack_i.update();

    //If the package is out of the screen, remove it from the array
    if (pack_i.x + pack_i.width < 0) { idx.push(i) }
    //otherwise, draw it.
    else { pack_i.draw(); }
    
  }

  for (let i = 0; i < idx.length; i++) { arrayPackages.splice(idx[i],1); }

  //console.log(arrayPackages.length)
}

//Animation Loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  handlePackages();
  player.update();
  player.draw();
  gameFrame++;
  requestAnimationFrame(animate);
}
animate();
