// select canvas element
const canvas = document.getElementById("pong");

// getContext of canvas = methods and properties to draw and do a lot of thing to the canvas
const ctx = canvas.getContext('2d');

//alert to display game instructions
window.setTimeout(function(){
    alert("\nHow to Play:\n\nYou are 'User'. Move your cursor up/down to move your paddle up/down.");
}, 500); 

//size canvas to fit whole browser window
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

//function to resize windows
function windowResize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  //event handler for when window is resized
  window.addEventListener('resize', windowResize);

// Ball object
const ball = {
    x : canvas.width/2,
    y : canvas.height/2,
    radius : 10,
    velocityX : 5,
    velocityY : 5,
    speed : 7,
    color : "ORANGE"
}

// User Paddle
const user = {
    x : 0, // left side of canvas
    y : (canvas.height - 100)/2, // -100 the height of paddle
    width : 10,
    height : 100,
    score : 0,
    color : "WHITE"
}

// Ai Paddle
const com = {
    x : canvas.width - 10, // - width of paddle
    y : (canvas.height - 100)/2, // -100 the height of paddle
    width : 10,
    height : 100,
    score : 0,
    color : "WHITE"
}

// Net
const net = {
    x : (canvas.width-9)/2,
    y : 0,
    height : 8,
    width : 9,
    color : "#FEDE00"
}

// draw a rectangle, will be used to draw game board
function drawRect(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

// draw circle, will be used to draw the ball
function drawArc(x, y, r, color){
    ctx.fillStyle = color;
    ctx.shadowColor = "black";
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();
}

// listening to the mouse
canvas.addEventListener("mousemove", getMousePos);

//event handler for mousemove event
function getMousePos(evt){
    let rect = canvas.getBoundingClientRect();
    
    user.y = evt.clientY - rect.top - user.height/2;
}

// when ai or user scores, we reset the ball
function resetBall(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 7;
}

// draw the net
function drawNet(){
    
    for(let i = 0; i <= canvas.height; i+=19){
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

// draws player scores
function drawScore(text,x,y, colour){
    ctx.fillStyle = colour;
    ctx.font = "75px monospace";
    ctx.fillText(text, x, y);
}

//draws player labels (text saying 'User' and 'Ai')
function drawLabel(text, x, y, colour ){
    ctx.fillStyle = colour;
    ctx.font = "20px monospace";
    ctx.fillText(text, x, y);
}

// collision detection
function collision(b,p){
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;
    
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;
    
    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

// update function, the function that does all calculations
function update(){
    
    // change the score of players, if the ball goes to the left "ball.x<0" computer win, else if "ball.x > canvas.width" the user win
    if( ball.x - ball.radius < 0 ){
        com.score++;
        resetBall();
    }else if( ball.x + ball.radius > canvas.width){
        user.score++;
        resetBall();
    }
    
    // the ball has a velocity
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    
    // computer plays for itself, and we must be able to beat it
    com.y += ((ball.y - (com.y + com.height/2)))*0.1;
    
    // when the ball collides with bottom and top walls we inverse the y velocity.
    if(ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height){
        ball.velocityY = -ball.velocityY;
    }
    
    // we check if the paddle hit the user or the ai paddle
    let player = (ball.x + ball.radius < canvas.width/2) ? user : com;
    
    // if the ball hits a paddle
    if(collision(ball,player)){
        // we check where the ball hits the paddle
        let collidePoint = (ball.y - (player.y + player.height/2));
        // normalize the value of collidePoint, we need to get numbers between -1 and 1.
        // -player.height/2 < collide Point < player.height/2
        collidePoint = collidePoint / (player.height/2);
        
        // when the ball hits the top of a paddle we want the ball, to take a -45degees angle
        // when the ball hits the center of the paddle we want the ball to take a 0degrees angle
        // when the ball hits the bottom of the paddle we want the ball to take a 45degrees
        // Math.PI/4 = 45degrees
        let angleRad = (Math.PI/4) * collidePoint;
        
        // change the X and Y velocity direction
        let direction = (ball.x + ball.radius < canvas.width/2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);
        
        // speed up the ball everytime a paddle hits it.
        ball.speed += 0.1;
    }
}

// render function, the function that does all the drawing
function render(){
    
    // clear the canvas, draw the game board 
    drawRect(0, 0, canvas.width, canvas.height, "#FF6961");
    drawRect(canvas.width/2, 0, canvas.width/2, canvas.height, "#AEC6CF");
    
    // draw the user score 
    drawScore(user.score,canvas.width/4.5,canvas.height/5, "WHITE");

    //draw user label 
    drawLabel("User", canvas.width/4.5, canvas.height/4, "WHITE");
    
    // draw the ai score 
    drawScore(com.score,3.3*canvas.width/4.5,canvas.height/5, "BLACK");

    // draw ai label 
    drawLabel("Ai", 3.35*canvas.width/4.5, canvas.height/4, "BLACK");
    
    // draw the net
    drawNet();
    
    // draw the user's paddle
    drawRect(user.x, user.y, user.width, user.height, user.color);
    
    // draw the ai's paddle
    drawRect(com.x, com.y, com.width, com.height, com.color);
    
    // draw the ball
    drawArc(ball.x, ball.y, ball.radius, ball.color);
}
function game(){
    update();
    render();
}
// number of frames per second
let framePerSecond = 50;

//call the game function 50 times every 1 Sec
let loop = setInterval(game,1000/framePerSecond);

