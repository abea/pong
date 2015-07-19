// width="640px" height="480px" 
  
  $(document).ready(function() {

    var field = document.getElementById('field'),
        context = field.getContext("2d"),
        midWidth = (field.width / 2),
        midHeight = (field.height / 2),
        ceiling = 0,
        floor = field.height;
    var computerScore = 0,
        playerScore = 0,
        winningScore = 11;
    
    function drawField() {
      context.beginPath();
      context.moveTo(midWidth, ceiling);
      context.lineTo(midWidth, floor);
      context.strokeStyle = 'white';
      context.lineWidth = 8;
      context.stroke();
    }

    function Paddle(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      var increment = 40;
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
      this.paddleStart = paddle;
      this.render = function() {
        context.fillStyle = 'yellow';
        context.beginPath();
        context.fillRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);
//        if (this.playerType === 'computer') {
//          $('.compinfo').text(this.getCompInfo());
//        }
      };
      var movePaddle = function(e) {
        this.paddle.move(e);
        console.log(this.paddle.getPos());
      };
      this.movePaddle = movePaddle;
// ********************** AI ***************************      
      var compYSpeed = 0;
      var maxCompSpeed = 3;
      var updateComp = function( ) {
        if ((ball.ySpeed >= (-1 * maxCompSpeed)) && (ball.ySpeed <= maxCompSpeed)) {
          this.compYSpeed = ball.ySpeed;
          this.paddle.y += this.compYSpeed;
        } else {
          this.compYSpeed = maxCompSpeed*Math.sign(ball.ySpeed);
          this.paddle.y += this.compYSpeed;          
        }
      };
      this.resetPaddle = function() {
        this.paddle.y = paddleResetY;
      };
      if (this.playerType === 'computer') {
        this.compYSpeed = compYSpeed;
        this.updateComp = updateComp;
        this.getCompInfo = function() {
        return this.compYSpeed;
        };
      }
// *********************************************************
    }
    var paddleResetY = (midHeight - (paddleHeight/2));
    var player = new Player(
      'human', 
      new Paddle(rightSide, paddleResetY, paddleWidth, paddleHeight)
    );
    var computer = new Player(
      'computer', 
      new Paddle(leftSide, paddleResetY, paddleWidth, paddleHeight)
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
        return (Math.random() * (max - min + 1)) + min;
      }
      this.xSpeed = getRandomIntInclusive(minXSpeed, maxSpeed);
      this.ySpeed = getRandomIntInclusive(minYSpeed, maxSpeed);
      this.getBallInfo = function() {
        return this.ySpeed;
      };

      this.moveBall = function(){
//        $('.ballPos').text(this.getBallInfo());
        this.x += this.xSpeed;
        this.y += this.ySpeed;
        if (this.y - this.radius < ceiling || this.y + this.radius > floor) { 
          this.ySpeed = this.ySpeed * -1;    
        }
        if ((this.x + this.radius > player.paddle.x ) &&
            (this.y > player.paddle.y &&
             this.y < player.paddle.y + paddleHeight) 
           ) { 
          this.xSpeed = (this.xSpeed * -1.05);
          this.ySpeed = (this.ySpeed * 1.05);
        } else if (this.x - this.radius < computer.paddle.x + paddleWidth &&
            (this.y > computer.paddle.y &&
             this.y < computer.paddle.y + paddleHeight)) { 
          this.xSpeed = (this.xSpeed * -1.05);
          this.ySpeed = (this.ySpeed * 1.05) ;
        }

      };
      this.reset = function (){
        this.x = placeBall.x;
        this.y = placeBall.y;
      };
      this.resetBall = function (){
          this.x = placeBall.x;
          this.y = placeBall.y;
          this.xSpeed = getRandomIntInclusive(minXSpeed, maxSpeed);
          this.ySpeed = getRandomIntInclusive(minYSpeed, maxSpeed);
      };

    }
    var ball = new createBall(kickOffPoint);

    var stop = false;
    var gameOverMessage = function(message){
      $('.endgame').css('display','block');
      $('.endgame').html('<h2>' + message + '</h2><p>Refresh the page to play again.</p>');        
    };
    function endGame (){
      console.log('end game. computer' + computerScore + '// player' + playerScore);
      if (playerScore === 11) {
        gameOverMessage("You Win!");
      } else if (computerScore === 11) {
        gameOverMessage("Game Over...");
      }
      playerScore = 0;
      computerScore = 0;
      stop = true;
    }
    function reset() {
      if (ball.x > (field.width + ball.radius) || ball.x < -ball.radius) {
        if (ball.x > (field.width + ball.radius)) {
          computerScore += 1;
          $('.playerone').html('Computer Score: ' + computerScore);
        } else {
          playerScore += 1;
          $('.playertwo').html('Player Score: ' + playerScore);
        }
        if (playerScore === winningScore || computerScore === winningScore) {
          endGame();
        } else {
          confirm('Ready? Click OK or hit Enter.');
        }
        ball.resetBall();
        computer.resetPaddle();
        player.resetPaddle();
      }
    }
    function update(){
      ball.moveBall();
      computer.updateComp();
    }
    function render() {
      player.render();
      computer.render();
      ball.render();
//      ball.endGame();
    }
    var animate = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame || 
        window.oRequestAnimationFrame || 
        window.msRequestAnimationFrame || function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
//    var shouldGo = true;
    function clear() {
      field.width = field.width;
    }
    function step() {
      if (!stop) {
        clear();
        drawField();
        render();
        update();
        animate(step);
        reset();
      }
    }

//  $(document).ready(function() {
//    gameInit();
    
    step();
    window.addEventListener("keypress", function(e) {player.movePaddle(e);});
  }); // END DOC.READY