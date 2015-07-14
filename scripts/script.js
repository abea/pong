// width="640px" height="480px" 
 
 (function(){
  "use strict";
// USE STRICT START

(function(){ 
//var paddlerFactory = function (paddle) {
//  return {
//    paddle: paddle;
//  };
//};
//var player = paddlerFactory(
//  new Paddle(460, 240, 8, 32);
//);
//var computer = paddlerFactory(
//  new Paddle()
//)
//   
//var player = {
//  setPaddle: function (paddle) {
//    this.paddle = paddle;
//  }
//}
})(); // To hide scraps; Remove on completion;
$( document ).ready(function() {

var field = document.getElementById('field');
var context = field.getContext("2d");
// DRAW MID-LINE
context.beginPath();
context.moveTo(320, 0);
context.lineTo(320, 480);
context.strokeStyle = 'white';
context.lineWidth = 8;
context.stroke();
// END MID-LINE  

// PADDLE / PLAYERS
function Paddle(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
}
function Player(paddle) {
  this.paddle = paddle;
  this.render = function () {
    context.fillStyle = 'black';
    context.beginPath();
    context.fillRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);
  };
}
function Computer(paddle) {
  this.paddle = paddle;
  this.render = function () {
    context.fillStyle = 'black';
    context.beginPath();
    context.fillRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);
  };
}
var player = new Player (
  new Paddle(620, 224, 8, 32) // Right side
);
var computer = new Computer (
  new Paddle(20, 224, 8, 32) // Left side
);

  
// BALL
function Ball(x, y) {
  this.x = x;
  this.y = y;
  this.render = function (){
    context.fillStyle = 'black';
    context.beginPath();
    context.arc(this.x, this.y, 6, 0, 2 * Math.PI);
    context.closePath();
    context.fill();
  };
}
var ball = new Ball(160, 240);
function render () {
  player.render();
  computer.render();
  ball.render();
}
render();

// RESET AFTER POINT
//field.width = field.width;

}); // END DOCUMENT.READY
// USE STRICT CLOSE
}());