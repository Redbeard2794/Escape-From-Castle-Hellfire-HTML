function Menu()
{
    this.playButton = new Image();
    this.playButton.src = 'textures/menuButtons/playButton.png';
    this.optionsButton = new Image();
    this.optionsButton.src = 'textures/menuButtons/optionsButton.png';

}
Menu.prototype.update = function()
{

}
Menu.prototype.draw = function()
{
    game.ctx.drawImage(this.playButton, 300, 50, 199, 38);
    game.ctx.drawImage(this.optionsButton, 300, 250, 199, 38);
}