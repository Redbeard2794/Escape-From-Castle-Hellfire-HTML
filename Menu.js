function Menu()
{
    this.playButton = new Image();
    this.playButton.src = 'textures/menuButtons/playButton.png';
    this.optionsButton = new Image();
    this.optionsButton.src = 'textures/menuButtons/optionsButton.png';
	this.multiplayerButton = new Image();
	this.multiplayerButton.src = 'textures/menuButtons/multiplayerButton.png';
	
	this.playButtonX = 300;
	this.playButtonY = 50;
	
	this.multiplayerButtonX = 300;
	this.multiplayerButtonY = 250;
	
	this.optionsButtonX = 300;
	this.optionsButtonY = 450;
	
	this.buttonWidth = 199;
	this.buttonHeight = 38;
}
Menu.prototype.update = function()
{

}
Menu.prototype.draw = function()
{
    game.ctx.drawImage(this.playButton, this.playButtonX, this.playButtonY, this.buttonWidth, this.buttonHeight);
	game.ctx.drawImage(this.multiplayerButton, this.multiplayerButtonX, this.multiplayerButtonY, this.buttonWidth, this.buttonHeight);
    game.ctx.drawImage(this.optionsButton, this.optionsButtonX, this.optionsButtonY, this.buttonWidth, this.buttonHeight);
}