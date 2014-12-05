function Platform(posX,posY)
{
    this.Sprite = new Image();
    this.Sprite.src = "textures/plat1.png"
    this.SpriteWidth = ;
    this.SpriteHeight = 8;

	this.fixDef = new b2FixtureDef;
	this.fixDef.density = 1.0;
	this.fixDef.friction = 0.5;
	this.fixDef.restitution = 0.2;
	
	this.bodyDef = new b2BodyDef;
	this.bodyDef.type = b2Body.b2_staticBody;
	this.bodyDef.userData = 'platform'
	this.bodyDef.owner = this;
	this.fixDef.shape = new b2PolygonShape;
	this.fixDef.shape.SetAsBox(this.SpriteWidth /2, this.SpriteHeight / 2);

	this.bodyDef.position.x = posX;
	this.bodyDef.position.y = posY;

    this.body = game.world.CreateBody(this.bodyDef).CreateFixture(this.fixDef);
}

Platform.prototype.hit = function(impulse,entity)
{

}
Platform.prototype.update = function()
{

}

Platform.prototype.draw = function()
{
    var pos = this.body.GetBody().GetPosition();
    var angle = this.body.GetBody().GetAngle();

    game.ctx.save();
    game.ctx.translate(pos.x, pos.y);
    game.ctx.rotate(angle);
    var scale = new b2Vec2(this.SpriteWidth / 2,this.SpriteHeight / 2);
    game.ctx.scale(scale, scale);
    game.ctx.drawImage(this.Sprite , -scale.x,-scale.y, this.SpriteWidth ,this.SpriteHeight );
    game.ctx.restore();
}