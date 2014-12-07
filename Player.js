function Player()
{
	//this.width = 30;
	//this.height = 140;

    this.spriteSheet = new Image();
    this.spriteSheetLeftWalk = new Image();
    this.spriteSheetRightIdle = new Image();
    this.spriteSheetLeftIdle = new Image();

    
    //sources of each sprite sheet
    this.spriteSheet.src = 'textures/PlayerRightFinal.png';
    this.spriteSheetLeftWalk.src = 'textures/PlayerLeftFinal.png';
    this.spriteSheetRightIdle.src = 'textures/playerIdleRightSheet.png';
    this.spriteSheetLeftIdle.src = 'textures/playerIdleLeftSheet.png';
    //current sprite
    this.currentSprite = this.spriteSheet;
    this.idle = true;
    this.right = false;

	this.SpriteWidth = 50;
	this.SpriteHeight = 72;

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
    //for animating the sprites
	this.currTime = Date.now();
	this.prevTime = 0;
	this.delta = 0;
	this.updateSprite1 = 0;
	this.sx = 0;
	this.sy = 0;
	this.moving = false;
	this.prevX = this.body.GetBody().GetPosition();
}
Player.prototype.update = function()
{
    //for animating the sprites
    this.prevTime = this.currTime;
    this.currTime = Date.now();
    this.delta = this.currTime - this.prevTime;
    if (this.currTime != this.prevTime)
        this.prevTime = this.currTime;
    //sprite sheet 1
    this.updateSprite1 += this.delta;
    if (this.idle == false) {
        this.SpriteWidth = 50;
        this.SpriteHeight = 72;
        if (this.updateSprite1 > 150) {
            this.sx += 50;
            if (this.sx >= 400)
                this.sx = 0;
            this.updateSprite1 = 0;
        }
    }
    else if (this.idle == true)
    {
        this.SpriteWidth = 42;
        this.SpriteHeight = 75;
        if(this.updateSprite1 > 150)
        {
            this.sx += 42;
            if (this.sx >= 672)
                this.sx = 0;
            this.updateSprite1 = 0;
        }
    }

    if(this.idle == true && this.right == true)
    {
        this.currentSprite = this.spriteSheetRightIdle;
    }
    else if(this.idle == true && this.right == false)
    {
        this.currentSprite = this.spriteSheetLeftIdle;
    }
    if (this.moving == true)
        this.idle = false;
    else this.idle = true;
    //console.log("moving "+this.moving)
    //console.log("idle "+this.idle);
}

Player.prototype.move = function(key)
{
    var pos = this.body.GetBody().GetPosition();
    body = this.body.GetBody();
    if (key == 'right') {
        this.right = true;
        this.moving = true;
        this.idle = false;
        this.currentSprite = this.spriteSheet;
        if (body.IsAwake() == false) {
            body.SetAwake(true);
        }
        pos.x += 5;
        body.SetPosition(pos);

    }
    else if (key == 'left') {
        this.right = false;
        this.moving = true;
        this.idle = false;
        this.currentSprite = this.spriteSheetLeftWalk;
        if (body.IsAwake() == false) {
            body.SetAwake(true);
        }
        pos.x -= 5;
        body.SetPosition(pos);
    }
    //else this.idle = true;
    
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
    var scale = new b2Vec2(this.SpriteWidth / 2,this.SpriteHeight / 2);
    game.ctx.scale(scale, scale);
    if(this.currentSprite == this.spriteSheet && this.idle == false)
        game.ctx.drawImage(this.spriteSheet, this.sx, this.sy, this.SpriteWidth, this.SpriteHeight, -scale.x, -scale.y, 45, 73);
    else if (this.currentSprite == this.spriteSheetLeftWalk && this.idle == false)
        game.ctx.drawImage(this.spriteSheetLeftWalk, this.sx, this.sy, this.SpriteWidth, this.SpriteHeight, -scale.x, -scale.y, 45, 73);
    else if (this.currentSprite == this.spriteSheetRightIdle && this.idle == true)
        game.ctx.drawImage(this.spriteSheetRightIdle, this.sx, this.sy, this.SpriteWidth, this.SpriteHeight, -scale.x, -scale.y, 45, 73);
    else if (this.currentSprite == this.spriteSheetLeftIdle && this.idle == true)
        game.ctx.drawImage(this.spriteSheetLeftIdle, this.sx, this.sy, this.SpriteWidth, this.SpriteHeight, -scale.x, -scale.y, 45, 73);
    game.ctx.restore();
	
}