var game;
//http://glasnost.itcarlow.ie/~obroind/Games%20Devices/

//Box2D Variables
var b2Vec2 = Box2D.Common.Math.b2Vec2, b2BodyDef = Box2D.Dynamics.b2BodyDef, b2Body = Box2D.Dynamics.b2Body, b2FixtureDef = Box2D.Dynamics.b2FixtureDef, b2Fixture = Box2D.Dynamics.b2Fixture, b2World = Box2D.Dynamics.b2World
                , b2MassData = Box2D.Collision.Shapes.b2MassData, b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape, b2CircleShape = Box2D.Collision.Shapes.b2CircleShape, b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

var SCALE = 30

var SPLASH = 0, MENU = 1, GAME = 2;
var gameState;

function main() {
    game = new Game();
    init(); //initalize Box2D world (all object creation must be done after this)
    //listeners
    game.menu = new Menu();
    game.numPlatforms = 18;
    game.player = new Player();
    game.platforms = [];
    game.trapList = [];

    var trap1 = new proxTrap(new b2Vec2(450, 0));
    var trap2 = new proxTrap(new b2Vec2(1080, 0));
    var trap3 = new proxTrap(new b2Vec2(1220, 0));

    game.trapList[game.trapList.length] = trap1;
    game.trapList[game.trapList.length] = trap2;
    game.trapList[game.trapList.length] = trap3;

    //load the platforms(for now)
    loadLevel();
    //audio
    //http://gamedev.stackexchange.com/questions/60139/play-audio-in-javascript-with-a-good-performance
    //game.audio = document.createElement("audio");
    //game.audio.src = "sounds/wilhelmScream.wav";

    //for (var i = 0; i < game.numPlatforms; i++) {
    //    game.platforms[game.platforms.length] = new Platform((80 * i) + 1, 300);
    //}
    document.addEventListener("keydown", keyDownHandler, true);

    game.addContactListener(
        {
            BeginContact: function (idA, idB) {
            },

            //PreSolve: function (contact, oldManifold) {
            //    contact.SetEnabled(false);
            //    var bodyA = contact.GetFixtureA().GetBody();
            //    var bodyB = contact.GetFixtureB().GetBody();
            //    if(bodyA.GetUserData() == 'player' && bodyB.GetUserData() == 'platform')
            //    {
            //        bodyA.SetLinearVelocity(new b2Vec2(bodyA.GetLinearVelocity().x, -1));
            //        bodyA.GetOwner().hit(null, bodyB.GetUserData());
            //    }
            //    else if (bodyB.GetUserData() == 'player' && bodyA.GetUserData() == 'platform') {
            //        bodyB.SetLinearVelocity(new b2Vec2(bodyB.GetLinearVelocity().x, -1));
            //        bodyB.GetOwner().hit(null, bodyA.GetUserData());
            //    }
            //},
            PostSolve: function (bodyA, bodyB, impulse) {
                if (impulse < 0.1) { return; } // playing with thresholds
                if (bodyA.GetUserData() == 'player' && bodyB.GetUserData() == 'platform' ||
                    bodyA.GetUserData() == 'platform' && bodyB.GetUserData() == 'player') {
                    bodyA.GetOwner().hit(impulse, bodyB.GetUserData());
                    bodyB.GetOwner().hit(impulse, bodyA.GetUserData());
                }
                else if (bodyA.GetUserData() == 'proxtrap' && bodyB.GetUserData() == 'platform' ||
                    bodyA.GetUserData() == 'platform' && bodyB.GetUserData() == 'proxtrap') {

                }
                else if (bodyA.GetUserData() == 'player' && bodyB.GetUserData() == 'proxtrap' ||
                    bodyA.GetUserData() == 'proxtrap' && bodyB.GetUserData() == 'platform') {
                    bodyA.GetOwner().hit(impulse, bodyB.GetUserData());
                    bodyB.GetOwner().hit(impulse, bodyA.GetUserData());
                }
            }

        });

    gameState = MENU;
    //stuff for UI(May move it somewhere else after)
    game.jumpButton = new Image();
    game.jumpButton.src = 'textures/UiButtons/JumpButton.png';
    game.leftArrow = new Image();
    game.leftArrow.src = 'textures/UiButtons/SourceArrowTQLeft.png';
    game.rightArrow = new Image();
    game.rightArrow.src = 'textures/UiButtons/SourceArrowTQ.png';

    game.leftArrowX = 0;
    game.leftArrowY = 395;
    game.rightArrowX = 500;
    game.rightArrowY = 395;
    game.jumpX = 190;
    game.jumpY = 410;

    game.background = new Image();
    game.background.src = 'textures/level1Background.png';
	
	game.splash = new Image();
	game.splash.src = 'textures/SplashScreen.png';
	
    game.timer = 0;
    game.secTimer = 0;

    game.debug();

    document.addEventListener("mousedown", function(e){game.Clicked(e);});


    requestAnimFrame(game.update); //kickoff the update cycle
}

Game.prototype.Clicked = function(e)
{
    console.log("Clicked");
    if(gameState == MENU)
    {
        e.preventDefault();
        if (e.clientX > game.menu.playButtonX && e.clientX < game.menu.playButtonX + game.menu.buttonWidth
            && e.clientY > game.menu.playButtonY && e.clientY < game.menu.playButtonY + game.menu.buttonHeight) 
        {
            console.log("Changing gameState to GAME");
            gameState = GAME;
        }
        else if (e.clientX > game.menu.multiplayerButtonX && e.clientX < game.menu.multiplayerButtonX + game.menu.buttonWidth
            && e.clientY > game.menu.multiplayerButtonY && e.clientY < game.menu.multiplayerButtonY + game.menu.buttonHeight) 
        {
            console.log("Multiplayer coming soon");
        }
        else if (e.clientX > game.menu.optionsButtonX && e.clientX < game.menu.optionsButtonX + game.menu.buttonWidth
            && e.clientY > game.menu.optionsButtonY && e.clientY < game.menu.optionsButtonY + game.menu.buttonHeight) 
        {
            console.log("options coming soon");
        }
    }
}

function loadLevel(plats) {
	//loads from external xml file

    xmlDoc=loadXMLDoc("levels/Level1.xml");
    for (var i = 0; i < game.numPlatforms; i++) {
        var x;
        var y;

        x = xmlDoc.getElementsByTagName("x")[i].childNodes[0].nodeValue;
        y = xmlDoc.getElementsByTagName("y")[i].childNodes[0].nodeValue;

        game.platforms[game.platforms.length] = new Platform(x, y);
    }


}

//for loading from an external xml file
//source: http://www.w3schools.com/dom/dom_loadxmldoc.asp
function loadXMLDoc(filename)
{
    if (window.XMLHttpRequest)
      {
		xhttp=new XMLHttpRequest();
      }
    else // code for IE5 and IE6(of course IE has to be different!)
      {
		xhttp=new ActiveXObject("Microsoft.XMLHTTP");
      }
    xhttp.open("GET",filename,false);
    xhttp.send();
    return xhttp.responseXML;
} 

function init() {
    //setTimeout(function () { game.player.loadImages() }, 2000);
    //setTimeout(function () { game.loadAssets() }, 2000);
    game.world = new b2World(new b2Vec2(0, 10), true);

    var fixDef = new b2FixtureDef;
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;
    var bodyDef = new b2BodyDef;
    //create ground
    bodyDef.type = b2Body.b2_staticBody;
    // positions the center of the object (not upper left!)
    bodyDef.position.x = (game.screenWidth / 2) / SCALE;
    bodyDef.position.y = game.screenHeight / SCALE;
    bodyDef.userData = 'ground';
    fixDef.shape = new b2PolygonShape;

    fixDef.shape.SetAsBox((game.screenWidth / SCALE) / 2, (15 / SCALE) / 2);
    game.world.CreateBody(bodyDef).CreateFixture(fixDef);


}; // init()

Game.prototype.debug = function () {
    this.debugDraw = new b2DebugDraw();
    this.debugDraw.SetSprite(this.ctx);
    this.debugDraw.SetDrawScale(SCALE);
    this.debugDraw.SetFillAlpha(0.1);
    this.debugDraw.SetLineThickness(.5);
    this.debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
    this.world.SetDebugDraw(this.debugDraw);
};

function Game() {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;

    this.touches = [];

    //initializations
    this.initCanvas();
    this.initTouch();

}

Game.prototype.loadAssets = function () {
    //game.audio.src = "sounds/wilhelmScream.ogg";
    game.jumpButton.src = 'textures/UiButtons/JumpButton.png';
    game.leftArrow.src = 'textures/UiButtons/SourceArrowTQLeft.png';
    game.rightArrow.src = 'textures/UiButtons/SourceArrowTQ.png';
    game.background.src = 'textures/level1Background.png';
}

Game.prototype.addContactListener = function (callbacks) {
    var listener = new Box2D.Dynamics.b2ContactListener;
    if (callbacks.BeginContact) listener.BeginContact = function (contact) {
        callbacks.BeginContact(contact.GetFixtureA().GetBody().GetUserData(),
                               contact.GetFixtureB().GetBody().GetUserData());
    }
    if (callbacks.EndContact) listener.EndContact = function (contact) {
        callbacks.EndContact(contact.GetFixtureA().GetBody().GetUserData(),
                             contact.GetFixtureB().GetBody().GetUserData());
    }
    if (callbacks.PostSolve) listener.PostSolve = function (contact, impulse) {
        callbacks.PostSolve(contact.GetFixtureA().GetBody(),
                             contact.GetFixtureB().GetBody(),
                             impulse.normalImpulses[0]);
    }
    if (callbacks.PreSolve) listener.PreSolve = function (contact, oldManifold) {
        callbacks.PreSolve(contact, oldManifold);
    }
    this.world.SetContactListener(listener);
}
Game.prototype.initCanvas = function () {
    //create a canvas element
    this.canvas = document.createElement('canvas');

    /*create a 2d context for drawing*/
    this.ctx = this.canvas.getContext('2d');

    //add canvas to html document
    document.body.appendChild(this.canvas);

    //make a full screen canvas to draw on
    this.canvas.width = this.screenWidth;
    this.canvas.height = this.screenHeight;
}
Game.prototype.initTouch = function () {
    //1. is this running in a touch capable environment?
    touchable = 'createTouch' in document;

    //2. If it is touchable, add a listener
    if (touchable) {
        this.canvas.addEventListener('touchstart', onTouchStart, false);
        this.canvas.addEventListener('touchmove', onTouchMove, false);
        this.canvas.addEventListener('touchend', onTouchEnd, false);
    }

}

Game.prototype.update = function () {
    if (gameState == GAME) {
        game.world.Step(
         1 / 30   //frame-rate
      , 7       //velocity iterations
	  , 7       //position iterations
	  );

        game.world.ClearForces();
        game.checkTraps();
        game.player.update();
        for (var i = 0; i < game.numPlatforms; i++) {
            game.platforms[i].update(game.player.body.GetLinearVelocity());
        }
        for (var i = 0; i < game.trapList.length; i++) {
            game.trapList[i].update(game.player.body.GetLinearVelocity());
        }
        if(game.secTimer < 60)
        {
            game.secTimer+=1;
        }
        else
        {
            game.secTimer = 0;
            game.timer+=1;
        }

    }


    game.draw();
    //game.world.DrawDebugData();
    
    requestAnimFrame(game.update);
}


Game.prototype.checkTraps = function () {
    var theList = game.trapList;
    var size = theList.length;
    var playerPos = game.player.body.GetPosition().x * 30;
    for (var i = 0; i < size; i++) {
        var trapPos = theList[i].body.GetPosition().x * 30;
        var distance = trapPos - playerPos;
        if (distance < 60) {
            theList[i].Trigger();
        }
    }
}

Game.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.screenWidth, this.screenHeight);

    //this.ctx.save();
    //this.ctx.translate(-200, 0);
    //this.ctx.drawImage(game.background, 0, 0, 3499, 479);
    //this.ctx.restore();


    //touches is an array that holds all the touch info
    //use it e.g. draw a circle around each finger
    for (var i = 0; i < this.touches.length; i++) {
        var touch = this.touches[i];
        if (gameState == GAME) {
            if (touch.clientX > this.leftArrowX && touch.clientX < this.leftArrowX + 178 && touch.clientY > this.leftArrowY && touch.clientY < this.leftArrowY + 479) {
                game.player.move('left');
                console.log("Left arrow touched");
            }
            else if (touch.clientX > this.rightArrowX && touch.clientX < this.rightArrowX + 678 && touch.clientY > this.rightArrowY && touch.clientY < this.rightArrowY + 479) {
                game.player.move('right');
                console.log("Right arrow touched");
            }
            else if (touch.clientX > 190 && touch.clientX < 678 && touch.clientY > 395 && touch.clientY < 479) {
                game.player.jump();
                //game.audio.play();
            }
        }
        else if (gameState == MENU) {
            if (touch.clientX > game.menu.playButtonX && touch.clientX < game.menu.playButtonX + game.menu.buttonWidth
			&& touch.clientY > game.menu.playButtonY && touch.clientY < game.menu.playButtonY + game.menu.buttonHeight) {
                gameState = GAME;
                console.log("Play button touched");
            }

            if (touch.clientX > game.menu.multiplayerButtonX && touch.clientX < game.menu.multiplayerButtonX + game.menu.buttonWidth
			&& touch.clientY > game.menu.multiplayerButtonY && touch.clientY < game.menu.multiplayerButtonY + game.menu.buttonHeight) {
                console.log("multiplayer button touched");
            }

            if (touch.clientX > game.menu.optionsButtonX && touch.clientX < game.menu.optionsButtonX + game.menu.buttonWidth
			&& touch.clientY > game.menu.optionsButtonY && touch.clientY < game.menu.optionsButtonY + game.menu.buttonHeight) {
                console.log("options button touched");
            }
        }
        // }
    }

    if (gameState == GAME) {
        this.ctx.save();

        this.ctx.save();
        this.ctx.translate(-200, 0);
        this.ctx.drawImage(game.background, 0, 0, 3499, 479);
        this.ctx.restore();

        var playerPos = game.player.body.GetPosition();
       // this.ctx.translate(-playerPos.x * SCALE, 1)

        for (var i = 0; i < game.numPlatforms; i++) {
            game.platforms[i].draw();
            //if (playerPos != game.platforms.prevPlayerPos)
            //{
            //    game.platforms[i].updateBody();
            //    game.platforms[i].prevPlayerPos = playerPos;
            //}
        }
        for (var i = 0; i < game.trapList.length; i++) {
            game.trapList[i].draw();
        }
       // this.ctx.restore();

        this.ctx.save();
        this.ctx.translate(game.jumpX, game.jumpY);
        this.ctx.drawImage(game.jumpButton, 0, 0, 298, 57);
        this.ctx.restore();


        this.ctx.save();
        this.ctx.translate(game.leftArrowX, game.leftArrowY);
        this.ctx.drawImage(game.leftArrow, 0, 0, 178, 84);
        this.ctx.restore();

        this.ctx.save();
        this.ctx.translate(game.rightArrowX, game.rightArrowY);
        this.ctx.drawImage(game.rightArrow, 0, 0, 178, 84);
        this.ctx.restore();


        this.ctx.font = "30px Arial";
        this.ctx.fillText("Time: " + game.timer,25,30);
        this.ctx.fillText("Deaths: ", 25, 60)

        game.player.draw();
    }
    else if (gameState == MENU) {
        game.menu.draw();
    }
	
	else if (gameState == SPLASH)
	{
		this.ctx.save();
        this.ctx.translate(200, 200);
        this.ctx.drawImage(game.splash, 0, 0, 517, 198);
        this.ctx.restore();
	}

}

function onTouchMove(e) {
    e.preventDefault();
    game.touches = e.touches;
    game.draw();
}
function onTouchStart(e) {
    e.preventDefault();
    game.touches = e.touches;
    //UITouched();//calls the method to check if the touch occurred within a UI element e.g. jump button
    game.draw();
}
function onTouchEnd(e) {
    game.touches = e.touches;
}

//function UITouched()
//{
//    for (var i = 0; i < this.touches.length; i++) {
//        var touch = this.touches[i];
//        if (touch.clientX > 0 && touch.clientX < 178 && touch.clientY > 395 && touch.clientY < 479) {
//            game.player.move('left');
//            console.log("Left arrow touched");
//        }
//        else if (touch.clientX > 500 && touch.clientX < 678 && touch.clientY > 395 && touch.clientY < 479) {
//            game.player.move('right');
//            console.log("Right arrow touched");
//        }
//        else if (touch.clientX > 190 && touch.clientX < 678 && touch.clientY > 395 && touch.clientY < 479) {
//            game.player.jump();
//        }
//    }
//}

function keyDownHandler(e) {

    if (e.keyCode == "68")//up 38, 87 D
    {
        game.player.move('right');
        for (var i = 0; i < game.numPlatforms; i++) {
            game.platforms[i].updateBody('right');
        }
        for (var i = 0; i < game.trapList.length; i++) {
            game.trapList[i].updateBody('right');
        }
    }
    if (e.keyCode == "65")//down 40, 83 A
    {
        game.player.move('left');
        for (var i = 0; i < game.numPlatforms; i++) {
            game.platforms[i].updateBody('left');
        }
        for (var i = 0; i < game.trapList.length; i++) {
            game.trapList[i].updateBody('left');
        }
        //game.audio.play();//MAKE SURE TO REMOVE AS IT IS FUCKING ANNOYING
    }
    if (e.keyCode == "32") {
        game.player.jump();
    }
	
	//for testing purposes only
	if(gameState == MENU && e.keyCode == "68")
	{
		//gameState = GAME;
	}
	
}

//Utilities
/*function that provides access to request animation frame on all browsers */
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
})();
/*function for rgb for convenience*/
function rgb(r, g, b)
{ return 'rgb(' + clamp(Math.round(r), 0, 255) + ', ' + clamp(Math.round(g), 0, 255) + ', ' + clamp(Math.round(b), 0, 255) + ')'; };

/*helper function*/
function clamp(value, min, max) {
    if (max < min) {
        var temp = min;
        min = max;
        max = temp;
    }
    return Math.max(min, Math.min(value, max));
};