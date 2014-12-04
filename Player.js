function Player()
{
	//this.width = 30;
	//this.height = 140;

	this.spriteSheet = new Image();
	this.spriteSheet.src = 'textures/PlayerRightFixed.png';

	this.SpriteWidth = 40;
	this.SpriteHeight = 20;

	this.fixDef = new b2FixtureDef;
	this.fixDef.density = 1.0;
	this.fixDef.friction = 0.5;
	this.fixDef.restitution = 0.2;

	this.bodyDef = new b2BodyDef;
	this.bodyDef.type = b2Body.b2_dynamicBody;
	this.bodyDef.userData = 'player';
	this.bodyDef.owner = this;
	this.fixDef.shape = new b2PolygonShape;
	this.fixDef.shape.SetAsBox(this.SpriteWidth / 2, this.SpriteHeight / 2);

	this.bodyDef.position.x = 100;
	this.bodyDef.position.y = 100;

	this.body = game.world.CreateBody(this.bodyDef).CreateFixture(this.fixDef);

}
Player.prototype.update = function()
{

}

Player.prototype.move = function(key)
{
    var pos = this.body.GetBody().GetPosition();
    if (key == 'up')
    {
        pos.y += 30;
        this.body.GetBody().SetPosition(pos);
    }
}

Player.prototype.hit = function(impulse, entity)
{
    
}

Player.prototype.draw = function()
{
    var pos = this.body.GetBody().GetPosition();
    var angle = this.body.GetBody().GetAngle();
    game.ctx.save();
    game.ctx.translate(pos.x, pos.y);
    game.ctx.rotate(angle);
    game.ctx.drawImage(this.spriteSheet, 0, 0, 45, 73, pos.x, pos.y, 45, 73);
    game.ctx.restore();
	
}