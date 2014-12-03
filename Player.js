function Player()
{
	this.x = 0;
	this.y = 0;
	//this.width = 30;
	//this.height = 140;

	this.spriteSheet = new Image();
	this.spriteSheet.src = 'textures/PlayerRightFixed.png';
	this.x = 0;
	this.y = 0;
	this.playerX=200;
	this.playerY=200;


}
Player.prototype.update = function()
{

}


Player.prototype.draw = function()
{
	var r = 0;
	var g = 255;
	var b = 0;

	game.ctx.fillStyle = rgb(r,g,b);

	//parameters are x,y,width,height
	//game.ctx.fillRect(this.x,this.y,this.width,this.height);
	game.ctx.drawImage(this.spriteSheet, this.x, this.y, 45, 81, this.playerX, this.playerY, 45, 81);
}