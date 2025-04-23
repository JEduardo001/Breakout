let ball, paddle, bricks = [];
let rows = 4, cols = 10;
let score = 0;
let lives = 3;
let gameStarted = false;
let level = 1;

/* 
    Integrantes: 
        Jose Eduardo Quirarte Arce
        Joaquin Manuel Vargas Hernandez
*/

function setup() {
  createCanvas(600, 400);
  resetGame();
}

// reset general por nivel o reinicio
function resetGame() {
  paddle = new Paddle();
  ball = new Ball();
  bricks = [];
  createBricks();
  gameStarted = false;
}

// funcion para crear los bloques
function createBricks() {
    let brickWidth = width / cols;
    let brickHeight = 20;
  
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let x = c * brickWidth;
        let y = r * brickHeight;
  
        if (level === 2 && r === 2 && c === 4) {
          // nivel 2: 1 bloque resistente
          bricks.push(new Brick(x, y, brickWidth, brickHeight, 3));
        } else if (level === 3) {
          // nivel 3:
          if ((r === 2 && c === 4) || (r === 3 && c === 5)) {
            // 2 bloques resistentes
            bricks.push(new Brick(x, y, brickWidth, brickHeight, 3));
          } else if (r === 1 && c === 1) {
            // bloque indestructible
            bricks.push(new Brick(x, y, brickWidth, brickHeight, 999, true));
          } else {
            // bloques normales
            bricks.push(new Brick(x, y, brickWidth, brickHeight));
          }
        } else {
          // nivel 1
          bricks.push(new Brick(x, y, brickWidth, brickHeight));
        }
      }
    }
  }
  

function draw() {
  background(30);

  paddle.show();
  paddle.move();

  if (gameStarted) {
    ball.update();
    ball.checkEdges();
    ball.checkPaddle(paddle);

    for (let i = bricks.length - 1; i >= 0; i--) {
        if (bricks[i].hit(ball)) {
          if (bricks[i].isDestroyed()) {
            bricks.splice(i, 1);
            score++;
          }
        }
    }
      
  } else {
    textSize(16);
    fill(255);
    text("Presiona ESPACIO para iniciar", width / 2 - 100, height / 2 + 50);
  }

  ball.show();

  for (let brick of bricks) {
    brick.show();
  }

 

  // en caso de que la pelota se salga de la pantalla
  if (ball.offScreen()) {
    lives--;
    if (lives > 0) {
      resetGame();
    } else {
      lives = 0;
      textSize(32);
      textAlign(CENTER);
      fill(255, 0, 0);
      text("¡Game Over!", width / 2, height / 2);
      noLoop();
    }
  }

  fill(255);
  textSize(14);
  text(`Puntos: ${score}`, 10, 20);
  text(`Vidas: ${lives}`, 10, 40);

  if (bricks.length === 0) {
    level++;
    startNextLevel();
  }
}


function startNextLevel() {
  if (level === 2) {
    rows = 5;
    ball.speedUp(1.2);
  } else if (level === 3) {
    rows = 6;
    ball.speedUp(1.4);
  } else {
    textSize(32);
    fill(0, 255, 0);
    textAlign(CENTER);
    text("¡Ganaste!", width / 2, height / 2);
    noLoop();
    return;
  }
  resetGame();
}

function keyPressed() {
  if (key === ' ') {
    gameStarted = true;
  }
}
// clase para las movimientos
class Paddle {
  constructor() {
    this.w = 100;
    this.h = 10;
    this.x = width / 2 - this.w / 2;
    this.y = height - 30;
    this.speed = 7;
  }

  move() {
    if (keyIsDown(LEFT_ARROW)) {
      this.x -= this.speed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.x += this.speed;
    }
    this.x = constrain(this.x, 0, width - this.w);
  }

  show() {
    fill(255);
    rect(this.x, this.y, this.w, this.h);
  }
}

class Ball {
  constructor() {
    this.r = 10;
    this.x = width / 2;
    this.y = height / 2;
    this.xSpeed = 5;
    this.ySpeed = -5;
  }

  update() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
  }

  show() {
    fill(255);
    ellipse(this.x, this.y, this.r * 2);
  }

  checkEdges() {
    if (this.x <= 0 || this.x >= width) this.xSpeed *= -1;
    if (this.y <= 0) this.ySpeed *= -1;
  }

  checkPaddle(paddle) {
    if (
      this.y + this.r >= paddle.y &&
      this.x > paddle.x &&
      this.x < paddle.x + paddle.w
    ) {
      this.ySpeed *= -1;
      this.y = paddle.y - this.r;
    }
  }

  offScreen() {
    return this.y > height;
  }

  speedUp(mult = 1.2) {
    this.xSpeed *= mult;
    this.ySpeed *= mult;
  }
  
}
class Brick {
    constructor(x, y, w, h, hits = 1, indestructible = false) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.hits = hits;
      this.indestructible = indestructible;
    }
  
    show() {
      if (this.indestructible) {
        fill(100, 100, 255);
      } else {
        if (this.hits === 3) fill(255, 100, 0);
        else if (this.hits === 2) fill(255, 150, 0);
        else fill(255, 100, 100);
      }
      rect(this.x, this.y, this.w, this.h);
    }
  
    hit(ball) {
      if (
        ball.x + ball.r > this.x &&
        ball.x - ball.r < this.x + this.w &&
        ball.y + ball.r > this.y &&
        ball.y - ball.r < this.y + this.h
      ) {
        ball.ySpeed *= -1;
        if (!this.indestructible) {
          this.hits--;
        }
        return true;
      }
      return false;
    }
  
    isDestroyed() {
      return !this.indestructible && this.hits <= 0;
    }
  }
  
