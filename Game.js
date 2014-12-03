var game;
//http://glasnost.itcarlow.ie/~obroind/Games%20Devices/
function Game()
{
	this.screenWidth = window.innerWidth;
	this.screenHeight = window.innerHeight;
	this.currTime = Date.now();
	this.prevTime = 0;
	this.delta = 0;

	this.touches = [];

}
Game.prototype.initCanvas = function()
{
	//create a canvas element
	this.canvas = document.createElement('canvas');

	/*create a 2d context for drawing*/
	this.ctx = this.canvas.getContext('2d');

	//add canvas to html document
	document.body.appendChild(this.canvas);

	//make a full screen canvas to draw on
	this.canvas.width = this.screenWidth;
	this.canvas.height = this.screenHeight;
}


Game.prototype.gameLoop = function()
{

	//window.requestAnimationFrame(game.gameLoop);


	game.update();
	game.draw();
}


Game.prototype.initTouch = function()
{
		//1. is this running in a touch capable environment?
	touchable = 'createTouch' in document; 
 
 
	//2. If it is touchable, add a listener
	if(touchable) {
        this.canvas.addEventListener( 'touchstart', onTouchStart, false );
        this.canvas.addEventListener( 'touchmove', onTouchMove, false );
        this.canvas.addEventListener( 'touchend', onTouchEnd, false );
	}

}

Game.prototype.update = function()
{
	this.prevTime = this.currTime;
	this.currTime = Date.now();

	this.delta = this.currTime - this.prevTime;

	if(this.currTime != this.prevTime)
		this.prevTime = this.currTime;

}

function onTouchMove(e)
{
	e.preventDefault();
	game.touches = e.touches;
	game.draw();
}
function onTouchStart(e)
{
	e.preventDefault();
	game.touches = e.touches;
	game.draw();
}
function onTouchEnd(e)
{
	game.touches = e.touches;
}
function main()
{
	game = new Game();

	game.player = new Player();
	//call initCanvas here
	game.initCanvas();

	game.draw();
	document.addEventListener("keydown", keyDownHandler, true);
	game.initTouch();

	game.gameLoop();


}



function keyDownHandler(e)
{

	if(e.keyCode == "87")//up 38, 87
		{
			//game.Paddle1.moveUp();
			//console.log("W detected");
		}

	if(e.keyCode == "83")//down 40, 83
		{
			//game.Paddle1.moveDown();
			//console.log("S detected");
		}
}



Game.prototype.draw = function()
{
	this.ctx.clearRect(0,0,this.screenWidth, this.screenHeight);

		//for rgb values
	var r = 128;
	var g = 0;
	var b = 0;

	this.ctx.fillStyle = rgb(r,g,b);


	this.ctx.font = "30px Arial";
	this.ctx.fillText("Welcome to Castle Hellfire!",0,30);
	//this.ctx.fillText("Computer",883,75);
	//this.ctx.fillText(this.humanScore + " - " + this.computerScore, this.screenWidth/2-27, this.screenHeight/2+23)
	

	//touches is an array that holds all the touch info
	//use it e.g. draw a circle around each finger
	for(var i=0; i< this.touches.length; i++)
	{
    	var touch = this.touches[i];
    	this.ctx.beginPath();
    	this.ctx.fillStyle = "white";
    	this.ctx.fillText(" x:"+touch.clientX+" y:"+touch.clientY, touch.clientX+30, touch.clientY-30);
    	this.ctx.beginPath();
    	this.ctx.strokeStyle = "red";
   	 	this.ctx.lineWidth = "6";
    	this.ctx.arc(touch.clientX, touch.clientY, 40, 0, Math.PI*2, true);
    	this.ctx.stroke();
	}

	game.player.draw();

}

/*function for rgb for convenience*/
function rgb(r, g, b) 
{ return 'rgb('+clamp(Math.round(r),0,255)+', '+clamp(Math.round(g),0,255)+', '+clamp(Math.round(b),0,255)+')';};

/*helper function*/
function clamp(value, min, max) { 
	if(max<min) { 
		var temp = min; 
		min = max; 
		max = temp; 
	}
	return Math.max(min, Math.min(value, max)); 
};