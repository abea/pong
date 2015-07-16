// width="640px" height="480px" 
  
  $(document).ready(function() {

    var field = document.getElementById('field'),
        context = field.getContext("2d"),
        midWidth = (field.width / 2),
        midHeight = (field.height / 2);
    var kickOffPoint = {
      x : (midWidth / 2),
      y : 240
    };
    
    function drawField() {
      context.beginPath();
      context.moveTo(midWidth, 0);
      context.lineTo(midWidth, field.height);
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
      var increment = 15;
      this.move = function(event) {
        switch (event.key) {
          case 'ArrowUp':
//            console.log('up' + this.y);
            if (this.y > increment ) {
              this.y = this.y - increment;
            } else if (this.y > 0 ) {
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
      
      this.getPos = function() {return [this.x, this.y]};
    }

    function Player(playerType, paddle) {
      this.playerType = playerType;
      this.paddle = paddle;
      this.render = function() {
        context.fillStyle = 'black';
        context.beginPath();
        context.fillRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);
      };
      
      var movePaddle = function(e) {
        this.paddle.move(e);
        console.log(this.paddle.getPos());
      };
      this.movePaddle = movePaddle;
    }
    var rightSide = field.width - 20,
        leftSide = 20,
        paddleWidth = 8,
        paddleHeight = 40;
    var player = new Player(
      'human', 
      new Paddle(rightSide, (midHeight - (paddleHeight/2)), paddleWidth, paddleHeight)
    );
    var computer = new Player(
      'computer', 
      new Paddle(leftSide, (midHeight - (paddleHeight/2)), paddleWidth, paddleHeight)
    );

    // BALL
    function Ball(placeBall) {
      this.x = placeBall.x;
      this.y = placeBall.y;
      this.render = function() {
        context.fillStyle = 'black';
        context.beginPath();
        context.arc(this.x, this.y, 6, 0, 2 * Math.PI);
        context.closePath();
        context.fill();
      };
    }

    var ball = new Ball(kickOffPoint);

    function render() {
        player.render();
        computer.render();
        ball.render();
      }
      // PADDLE CONTROL
    var animate = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame || 
        window.oRequestAnimationFrame || 
        window.msRequestAnimationFrame || function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };

    function step() {
      field.width = field.width;
      drawField();
      render();
      animate(step);
    }
  function gameInit(){


  }
  //$(document).ready(function() {
//    gameInit();
    
    step();
//    window.addEventListener("keydown", player.paddle.move);
    window.addEventListener("keypress", function(e) {player.movePaddle(e);});
  }); // END DOC.READY