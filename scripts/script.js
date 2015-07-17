// width="640px" height="480px" 
  
  $(document).ready(function() {

    var field = document.getElementById('field'),
        context = field.getContext("2d"),
        midWidth = (field.width / 2),
        midHeight = (field.height / 2),
        ceiling = 0,
        floor = field.height;
    
    function drawField() {
      context.beginPath();
      context.moveTo(midWidth, ceiling);
      context.lineTo(midWidth, floor);
      context.strokeStyle = 'white';
      context.lineWidth = 8;
      context.stroke();
    }


    // PADDLE / PLAYERS

    function Paddle(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      var increment = 30;
      this.move = function(event) {
        switch (event.key) {
          case 'ArrowUp':
//            console.log('up' + this.y);
            if (this.y > increment ) {
              this.y = this.y - increment;
            } else if (this.y > ceiling ) {
              this.y = this.y - this.y;
            }
            break;
          case 'ArrowDown':
//            console.log('down ' + this.y );
            if (this.y > (field.height-(this.height + increment))) {
              this.y = this.y + (field.height - (this.y + this.height));
            } else if (this.y < (field.height-this.height)) {
              this.y = this.y + increment;
            }
            break;
        }
        return;
      };
      this.getPos = function() {return [this.x, this.y];};
    }

    var paddleBuffer = 20,
        paddleWidth = 8,
        paddleHeight = 60,
        rightSide = field.width - paddleBuffer,
        leftSide = paddleBuffer - paddleWidth;
    function Player(playerType, paddle) {
      this.playerType = playerType;
      this.paddle = paddle;
      this.render = function() {
        context.fillStyle = 'yellow';
        context.beginPath();
        context.fillRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);
      };
      
      var movePaddle = function(e) {
        this.paddle.move(e);
        console.log(this.paddle.getPos());
      };
      this.movePaddle = movePaddle;
    }
    var player = new Player(
      'human', 
      new Paddle(rightSide, (midHeight - (paddleHeight/2)), paddleWidth, paddleHeight)
    );
    var computer = new Player(
      'computer', 
      new Paddle(leftSide, (midHeight - (paddleHeight/2)), paddleWidth, paddleHeight)
    );

    // BALL
    var ballSize = 8;
    var kickOffPoint = {
      x : (midWidth / 2),
      y : midHeight,
      radius : ballSize
    }; // Later make random;
  
    function createBall(placeBall) {
      this.x = placeBall.x;
      this.y = placeBall.y;
      this.radius = placeBall.radius;
      this.render = function() {
        context.fillStyle = 'white';
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        context.closePath();
        context.fill();
      };
      var minYSpeed = -3,
          minXSpeed = 2,
          maxSpeed = 3;
      function getRandomIntInclusive(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
      this.xSpeed = getRandomIntInclusive(minXSpeed, maxSpeed);
      this.ySpeed =   getRandomIntInclusive(minYSpeed, maxSpeed);
      this.getBallPos = function() {
        return [this.x, this.y];
      };

      this.moveBall = function(){
        $('.ballPos').text(this.getBallPos());
        this.x += this.xSpeed;
        this.y += this.ySpeed;
        if (this.y - this.radius < ceiling || this.y + this.radius > floor) { 
          this.ySpeed = this.ySpeed * -1;    
        }
        if ((this.x + this.radius > player.paddle.x ) &&
            (this.y > player.paddle.y &&
             this.y < player.paddle.y + paddleHeight) 
           )
        { 
          this.xSpeed = this.xSpeed * -1;    
        } else if (this.x - this.radius < computer.paddle.x + paddleWidth &&
            (this.y > computer.paddle.y &&
             this.y < computer.paddle.y + paddleHeight)) { 
          this.xSpeed = this.xSpeed * -1;    
        }
      };

    }

    var ball = new createBall(kickOffPoint);


    function render() {
      player.render();
      computer.render();
      ball.render();
      ball.moveBall();
    }
    // PADDLE CONTROL
    var animate = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame || 
        window.oRequestAnimationFrame || 
        window.msRequestAnimationFrame || function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
    
    function clear() {
      field.width = field.width;
    }
    function step() {
      clear();
      drawField();
      render();
      animate(step);
    }
//  function gameInit(){
//
//
//  }
//  $(document).ready(function() {
//    gameInit();
    
    step();
//    window.addEventListener("keydown", player.paddle.move);
    window.addEventListener("keypress", function(e) {player.movePaddle(e);});
  }); // END DOC.READY