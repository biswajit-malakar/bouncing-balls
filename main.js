// set up canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// function to generate random number

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function to generate random RGB color value

function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}



function Ball (x, y, velX, velY, size, color) {
   this.x = x;
   this.y = y;
   this.velX = velX;
   this.velY = velY;
   this.size = size;
   this.color = color;
}

Ball.prototype.draw = function() {
   ctx.beginPath();
   ctx.fillStyle = this.color;
   ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
   ctx.fill();
}
Ball.prototype.update_location = function() {
   if ((this.x + this.size) >= width) {
      this.velX = -(Math.abs(this.velX));
   }

   if ((this.x - this.size) <= 0) {
      this.velX = Math.abs(this.velX);
   }

   if ((this.y + this.size) >= height) {
      this.velY = -(Math.abs(this.velY));
   }

   if ((this.y - this.size) <= 0) {
      this.velY = Math.abs(this.velY);
   }

   this.x += this.velX;
   this.y += this.velY;
}

const balls = [];

while (balls.length < 25) {
   const size = random(10,20);
   const ball = new Ball(random(0+size, width-size), random(0+size, height-size), random(-7,7), random(-7,7), size, randomRGB());
   balls.push(ball);
}

const devilBall = {
   x : width/2,
   y : height/2,
   size : 20,
   draw : function() {
      ctx.beginPath();
      ctx.lineWidth = 5;
      ctx.strokeStyle = 'rgb(255, 255, 255)';
      ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
      ctx.stroke();
   },
   update_location : function(x, y) {
      this.x = x;
      this.y = y;
   },
   collisionDetect : function() {
      for (const ball of balls) {
         let dx = this.x - ball.x;
         let dy = this.y - ball.y;
         let distance = Math.sqrt(dx*dx + dy*dy);
         if (distance <= this.size+ball.size) {
            let cIdx = balls.indexOf(ball);
            let temp = balls[balls.length-1];
            balls[balls.length-1] = balls[cIdx];
            balls[cIdx] = temp;
            this.size += ball.size / 10;
            balls.pop();
         }
      }
   }
}


function loop() {
   ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
   ctx.fillRect(0, 0,  width, height);
   displyBallCount();
   for (const ball of balls) {
     ball.draw();
     ball.update_location();
   }
   devilBall.draw();

   requestAnimationFrame(loop);
}

loop();


canvas.addEventListener('mousemove', (position) => {
   devilBall.collisionDetect();
   devilBall.update_location(position.clientX, position.clientY);
});
canvas.addEventListener('touchmove', (event) => {
   devilBall.collisionDetect();
   let touch = event.targetTouches[0];
   devilBall.update_location(touch.pageX, touch.pageY);
   console.log(touch.pageX, touch.pageY);
});


function displyBallCount () {
   let p = document.querySelector('p');
   p.innerHTML = `${balls.length}`;
   if (balls.length < 2)
      p.innerHTML += ` ball left`;
   else  
   p.innerHTML += ` balls left`;
}
