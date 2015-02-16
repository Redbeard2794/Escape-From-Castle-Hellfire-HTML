function proxTrap(Position) {
    this.sprite = new Image();
    this.sprite.src = 'textures/SpikeFallTrap1.png';

    this.SpriteWidth = 53;
    this.SpriteHeight = 31;

    this.fixDef = new b2FixtureDef;
    this.fixDef.density = 1.0;
    this.fixDef.friction = 0.5;
    this.fixDef.restitution = 0.2;

    this.bodyDef = new b2BodyDef;
    this.bodyDef.type = b2Body.b2_kinematicBody;
    this.bodyDef.userData = 'proxtrap';
    this.bodyDef.owner = this;
    this.fixDef.shape = new b2PolygonShape;
    this.fixDef.shape.SetAsBox((this.SpriteWidth / 30) / 2, (this.SpriteHeight / 30) / 2);

    this.bodyDef.position.x = Position.x / 30;
    this.bodyDef.position.y = Position.y / 30;

    this.body = game.world.CreateBody(this.bodyDef);
    this.body.CreateFixture(this.fixDef);
}

proxTrap.prototype.Trigger = function () {
    this.body.SetType(b2Body.b2_dynamicBody);
}

proxTrap.prototype.hit = function () {

}
proxTrap.prototype.update = function (playerVelo) {
    if (playerVelo.x - this.body.GetLinearVelocity().x <= 0) {
        this.body.SetLinearVelocity(new b2Vec2(0, this.body.GetLinearVelocity().y));
    }
}

proxTrap.prototype.updateBody = function (key) {
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
proxTrap.prototype.draw = function () {
    var pos = this.body.GetPosition();
    var angle = this.body.GetAngle();

    game.ctx.save();
    game.ctx.translate(pos.x * SCALE, pos.y * SCALE);
    var size = new b2Vec2(this.SpriteWidth / 2, this.SpriteHeight / 2);
    game.ctx.scale(size, size);
    game.ctx.drawImage(this.sprite, -size.x, -size.y);
    game.ctx.restore();

}
