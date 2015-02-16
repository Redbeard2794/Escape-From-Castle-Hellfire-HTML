function Platform(posX,posY)
{
    this.Sprite = new Image();
    this.Sprite.src = "textures/plat1.png"
    this.SpriteWidth = 40;
    this.SpriteHeight = 8;
    this.worldupdate = false;
    this.wasMoved = false;
    this.prevPlayerPos = null;
	this.fixDef = new b2FixtureDef;
	this.fixDef.density = 1.0;
	this.fixDef.friction = 0.5;
	this.fixDef.restitution = 0.2;
	
	this.bodyDef = new b2BodyDef;
	this.bodyDef.type = b2Body.b2_kinematicBody;
	this.bodyDef.userData = 'platform'
	this.bodyDef.owner = this;
	this.fixDef.shape = new b2PolygonShape;
	this.fixDef.shape.SetAsBox((this.SpriteWidth / SCALE), (this.SpriteHeight / SCALE));

	this.bodyDef.position.x = posX / SCALE;
	this.bodyDef.position.y = posY / SCALE;

	this.body = game.world.CreateBody(this.bodyDef);
	this.body.CreateFixture(this.fixDef);
}

Platform.prototype.hit = function(impulse,entity)
{

}
Platform.prototype.updateBody = function (key)
{
    if (key == 'left') {
        if (this.body.IsAwake() == false) {
            this.body.SetAwake(true);
        }
        this.body.SetLinearVelocity(new b2Vec2(1, this.body.GetLinearVelocity().y));

    }
    else if (key == 'right') {
        if (this.body.IsAwake() == false) {
            this.body.SetAwake(true);
        }
        this.body.SetLinearVelocity(new b2Vec2(-1, this.body.GetLinearVelocity().y));
    }
}

Platform.prototype.update = function(playerVelo)
{
    if(playerVelo.x - this.body.GetLinearVelocity().x <= 0)
    {
        this.body.SetLinearVelocity(new b2Vec2(0, 0));
    }
 //   this.body.SetLinearVelocity(new b2Vec2(this.body.GetLinearVelocity().x, 0));
}
Platform.prototype.draw = function()
{
    var pos = this.body.GetPosition();
    var angle = this.body.GetAngle();

    game.ctx.save();
    game.ctx.translate(pos.x *SCALE, pos.y *SCALE);
    game.ctx.rotate(angle);
    var scale = new b2Vec2(this.SpriteWidth,this.SpriteHeight );
    game.ctx.scale(scale, scale);
    game.ctx.drawImage(this.Sprite, -scale.x, -scale.y, this.SpriteWidth * 2, this.SpriteHeight * 2);
    
    game.ctx.restore();

}