function Player()
{
	this.x = 30;
	this.y = 200;
	this.width = 30;
	this.height = 140;

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
	game.ctx.fillRect(this.x,this.y,this.width,this.height);
	game.ctx.drawImage(this.spriteSheet, this.sx, this.sy, 200, 149, this.playerX, this.playerY, 200, 150);
}