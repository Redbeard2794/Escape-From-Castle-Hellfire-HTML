function Player()
{
	//this.width = 30;
	//this.height = 140;
    this.isJumping = false;
    this.spriteSheet = new Image();
    this.spriteSheetLeftWalk = new Image();
    this.spriteSheetRightIdle = new Image();
    this.spriteSheetLeftIdle = new Image();
    this.moved = false;
    
	//horse sprite
	this.horseSpriteSheet = new Image();
	this.horseSpriteSheet.src = 'textures/Player/playerOnHorse.png';
	this.horseSpriteWidth = 90;
	this.horseSpriteHeight = 97;
	
    //sources of each sprite sheet
    this.spriteSheet.src = 'textures/player/PlayerRightFinal.png';
    this.spriteSheetLeftWalk.src = 'textures/player/PlayerLeftFinal.png';
    this.spriteSheetRightIdle.src = 'textures/player/playerIdleRightSheet.png';
    this.spriteSheetLeftIdle.src = 'textures/player/playerIdleLeftSheet.png';
    //current sprite
    this.currentSprite = this.spriteSheet;
    this.idle = true;
    this.right = true;

	this.SpriteWidth = 50;
	this.SpriteHeight = 72;

	//box2d body for level 1
	this.fixDef = new b2FixtureDef;
	this.fixDef.density = 1.0;
	this.fixDef.friction = 0.5;
	this.fixDef.restitution = 0.2;

	this.bodyDef = new b2BodyDef;
	this.bodyDef.type = b2Body.b2_dynamicBody;
	this.bodyDef.userData = 'player';
	this.bodyDef.owner = this;
	this.fixDef.shape = new b2PolygonShape;
	this.fixDef.shape.SetAsBox((this.SpriteWidth/ 30) /2, (this.SpriteHeight / 30) / 2);
	this.bodyDef.position.x = 100 /30;
	this.bodyDef.position.y = 100 /30;

	this.body = game.world.CreateBody(this.bodyDef);
	this.body.CreateFixture(this.fixDef);
	this.body.SetFixedRotation(true);
	
	//box2d body for level 2
	this.fixDef2 = new b2FixtureDef;
	this.fixDef2.density = 1.0;
	this.fixDef2.friction = 0.5;
	this.fixDef2.restitution = 0.2;
	
	this.bodyDef2 = new b2BodyDef;
	this.bodyDef2.type = b2Body.b2_dynamicBody;
	this.bodyDef2.userData = 'horse';
	this.bodyDef2.owner = this;
	this.fixDef2.shape = new b2PolygonShape;
	this.fixDef2.shape.SetAsBox((this.horseSpriteWidth/ 30) /2, (this.horseSpriteHeight / 30) / 2);
	this.bodyDef2.position.x = 200 /30;
	this.bodyDef2.position.y = 100 /30;

	this.body2 = game.world.CreateBody(this.bodyDef2);
	this.body2.CreateFixture(this.fixDef2);
	this.body2.SetFixedRotation(true);
	
    //for animating the sprites
	this.currTime = Date.now();
	this.prevTime = 0;
	this.delta = 0;
	this.updateSprite1 = 0;
	this.sx = 0;
	this.sy = 0;
	this.moving = false;
	this.prevX = this.body.GetPosition();
}

Player.prototype.loadImages = function()
{
    this.spriteSheet.src = 'textures/player/PlayerRightFinal.png';
    this.spriteSheetLeftWalk.src = 'textures/player/player/PlayerLeftFinal.png';
    this.spriteSheetRightIdle.src = 'textures/player/playerIdleRightSheet.png';
    this.spriteSheetLeftIdle.src = 'textures/player/playerIdleLeftSheet.png';
}

Player.prototype.update = function(currentLevel)
{
    //for animating the sprites
    this.prevTime = this.currTime;
    this.currTime = Date.now();
    this.delta = this.currTime - this.prevTime;
    if (this.currTime != this.prevTime)
        this.prevTime = this.currTime;
		
	if(currentLevel == 1)
	{
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
		if (this.body.GetLinearVelocity().x == 0) {
			this.moving = false;
			this.sx = 0;
			this.sy = 0;
		}
		if (this.moving == true)
			this.idle = false;
		else this.idle = true;
	}
	
	else if(currentLevel == 2)
	{
		this.updateSprite1 += this.delta;
		if (this.updateSprite1 > 120) //can fiddle with this number to speed up/slow down animation
		{
			this.sx += this.horseSpriteWidth;
			if (this.sx >= 720)
				this.sx = 0;
			this.updateSprite1 = 0;
		}
		
		//make the horse move constantly here
		
	}
    //console.log("moving "+this.moving)
    //console.log("idle "+this.idle);
}

Player.prototype.move = function(key)
{
    if (key == 'right') {
        this.right = true;
        this.moving = true;
        this.idle = false;
        this.currentSprite = this.spriteSheet;
        if (this.body.IsAwake() == false) {
            this.body.SetAwake(true);
        }
        this.body.SetLinearVelocity(new b2Vec2(1, this.body.GetLinearVelocity().y));

    }
    else if (key == 'left') {
        this.right = false;
        this.moving = true;
        this.idle = false;
        this.currentSprite = this.spriteSheetLeftWalk;
        if (this.body.IsAwake() == false) {
            this.body.SetAwake(true);
        }
        this.body.SetLinearVelocity(new b2Vec2(-1, this.body.GetLinearVelocity().y));
    }
    //else this.idle = true;
    
}

Player.prototype.jump = function(currentLevel)
{
	if(currentLevel == 1)
	{
		if (!this.isJumping) {
			var pos = this.body.GetPosition();
			this.body.ApplyImpulse(new b2Vec2(0, 150), pos);
			this.isJumping = true;
		}
	}
	else if(currentLevel == 2)
	{
		if(!this.isJumping)
		{
			var pos = this.body2.getPosition();
			this.body2.ApplyImpulse(new b2Vec2(0,150),pos);
			this.isJumping = true;
		}
	}
}
Player.prototype.hit = function(impulse, entity)
{
    if(entity == "platform" && this.body.GetLinearVelocity().y < 0)
    {
        this.isJumping = false;
    }
	else if(entity == "platform" && this.body2.GetLinearVelocity().y < 0)
	{
		this.isJumping = false;
	}
}

Player.prototype.draw = function(currentLevel)
{
	if(currentLevel == 1)
	{
		var pos = this.body.GetPosition();
		var angle = this.body.GetAngle();

		game.ctx.save();
		game.ctx.translate(pos.x * SCALE, pos.y * SCALE);
		game.ctx.rotate(angle);
		var scale = new b2Vec2(this.SpriteWidth / 2,this.SpriteHeight / 2);
		game.ctx.scale(scale, scale);
		if(this.currentSprite == this.spriteSheet && this.idle == false)
			game.ctx.drawImage(this.spriteSheet, this.sx, this.sy, this.SpriteWidth, this.SpriteHeight, -scale.x, -scale.y, this.SpriteWidth, this.SpriteHeight);
		else if (this.currentSprite == this.spriteSheetLeftWalk && this.idle == false)
			game.ctx.drawImage(this.spriteSheetLeftWalk, this.sx, this.sy, this.SpriteWidth, this.SpriteHeight, -scale.x, -scale.y, this.SpriteWidth, this.SpriteHeight);
		else if (this.currentSprite == this.spriteSheetRightIdle && this.idle == true)
			game.ctx.drawImage(this.spriteSheetRightIdle, this.sx, this.sy, this.SpriteWidth, this.SpriteHeight, -scale.x, -scale.y, this.SpriteWidth, this.SpriteHeight);
		else if (this.currentSprite == this.spriteSheetLeftIdle && this.idle == true)
			game.ctx.drawImage(this.spriteSheetLeftIdle, this.sx, this.sy, this.SpriteWidth, this.SpriteHeight, -scale.x, -scale.y, this.SpriteWidth, this.SpriteHeight);
		game.ctx.restore();
	}
	
	else if(currentLevel == 2)
	{
		var pos = this.body2.GetPosition();
		var angle = this.body2.GetAngle();
		
		game.ctx.save();
		game.ctx.translate(pos.x * SCALE, pos.y * SCALE);
		game.ctx.rotate(angle);
		
		var scale = new b2Vec2(this.horseSpriteWidth / 2,this.horseSpriteHeight / 2);
		game.ctx.scale(scale, scale);
		
		game.ctx.drawImage(this.horseSpriteSheet, this.sx, this.sy, this.horseSpriteWidth, 
			this.horseSpriteHeight, -scale.x, -scale.y, this.horseSpriteWidth, this.horseSpriteHeight);
		
		game.ctx.restore();
	}
	
}