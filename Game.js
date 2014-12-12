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
    game.numPlatforms = 20;
    game.player = new Player();
    game.platforms = [];
    //load the platforms(for now)
    loadLevel();
    //audio
    //http://gamedev.stackexchange.com/questions/60139/play-audio-in-javascript-with-a-good-performance
    game.audio = document.createElement("audio");
    game.audio.src = "sounds/wilhelmScream.ogg";

    //for (var i = 0; i < game.numPlatforms; i++) {
    //    game.platforms[game.platforms.length] = new Platform((80 * i) + 1, 300);
    //}
    document.addEventListener("keydown", keyDownHandler, true);

    game.addContactListener(
        {
            BeginContact: function (idA, idB) {
            },

            PostSolve: function (bodyA, bodyB, impulse) {
                if (impulse < 0.1) return; // playing with thresholds
                bodyA.GetOwner().hit(impulse, bodyB.GetUserData());
                bodyB.GetOwner().hit(impulse, bodyA.GetUserData());
            }
        });

    gameState = GAME;
    //stuff for UI(May move it somewhere else after)
    game.jumpButton = new Image();
    game.jumpButton.src = 'textures/JumpButton.png';
    game.leftArrow = new Image();
    game.leftArrow.src = 'textures/SourceArrowTQLeft.png';
    game.rightArrow = new Image();
    game.rightArrow.src = 'textures/SourceArrowTQ.png';

    game.leftArrowX = 0;
    game.leftArrowY = 395;
    game.rightArrowX = 500;
    game.rightArrowY = 395;
    game.jumpX = 190;
    game.jumpY = 410;

    game.background = new Image();
    game.background.src = 'textures/level1Background.png';
    game.debug();
    requestAnimFrame(game.update); //kickoff the update cycle
}

function loadLevel(plats)
{
    txt = "<level1>";
    txt = txt + "<Platform>"
    txt = txt + "<x>120</x>";
    txt = txt + "<y>315</y>";
    txt = txt + "</Platform>"

    txt = txt + "<Platform>"
    txt = txt + "<x>250</x>";
    txt = txt + "<y>315</y>";
    txt = txt + "</Platform>"

    txt = txt + "<Platform>"
    txt = txt + "<x>400</x>";
    txt = txt + "<y>315</y>";
    txt = txt + "</Platform>"

    //txt = txt + "<Platform>"
    //txt = txt + "<x>450</x>";
    //txt = txt + "<y>200</y>";
    //txt = txt + "</Platform>"

    txt = txt + "<Platform>"
    txt = txt + "<x>480</x>";
    txt = txt + "<y>240</y>";
    txt = txt + "</Platform>"

    txt = txt + "<Platform>"
    txt = txt + "<x>560</x>";
    txt = txt + "<y>160</y>";
    txt = txt + "</Platform>"

    txt = txt + "<Platform>"
    txt = txt + "<x>420</x>";
    txt = txt + "<y>80</y>";
    txt = txt + "</Platform>"

    txt = txt + "<Platform>"
    txt = txt + "<x>640</x>";
    txt = txt + "<y>60</y>";
    txt = txt + "</Platform>"

    txt = txt + "<Platform>"
    txt = txt + "<x>780</x>";
    txt = txt + "<y>60</y>";
    txt = txt + "</Platform>"

    txt = txt + "<Platform>"
    txt = txt + "<x>920</x>";
    txt = txt + "<y>60</y>";
    txt = txt + "</Platform>"

    txt = txt + "<Platform>"
    txt = txt + "<x>1060</x>";
    txt = txt + "<y>140</y>";
    txt = txt + "</Platform>"

    txt = txt + "<Platform>"
    txt = txt + "<x>1200</x>";
    txt = txt + "<y>220</y>";
    txt = txt + "</Platform>"

    txt = txt + "<Platform>"
    txt = txt + "<x>1340</x>";
    txt = txt + "<y>140</y>";
    txt = txt + "</Platform>"

    txt = txt + "<Platform>"
    txt = txt + "<x>1480</x>";
    txt = txt + "<y>300</y>";
    txt = txt + "</Platform>"

    txt = txt + "<Platform>"
    txt = txt + "<x>1620</x>";
    txt = txt + "<y>340</y>";
    txt = txt + "</Platform>"

    txt = txt + "<Platform>"
    txt = txt + "<x>1480</x>";
    txt = txt + "<y>300</y>";
    txt = txt + "</Platform>"

    txt = txt + "<Platform>"
    txt = txt + "<x>1760</x>";
    txt = txt + "<y>340</y>";
    txt = txt + "</Platform>"

    txt = txt + "<Platform>"
    txt = txt + "<x>1900</x>";
    txt = txt + "<y>340</y>";
    txt = txt + "</Platform>"

    txt = txt + "<Platform>"
    txt = txt + "<x>2040</x>";
    txt = txt + "<y>260</y>";
    txt = txt + "</Platform>"

    txt = txt + "<Platform>"
    txt = txt + "<x>2180</x>";
    txt = txt + "<y>140</y>";
    txt = txt + "</Platform>"

    txt = txt + "<Platform>"
    txt = txt + "<x>2320</x>";
    txt = txt + "<y>60</y>";
    txt = txt + "</Platform>"

    txt = txt + "<Platform>"
    txt = txt + "<x>2460</x>";
    txt = txt + "<y>140</y>";
    txt = txt + "</Platform>"

    txt = txt + "<Platform>"
    txt = txt + "<x>2700</x>";
    txt = txt + "<y>315</y>";
    txt = txt + "</Platform>"

    txt = txt + "</level1>";

    //if (window.XMLHttpRequest) {
    //    xhttp = new XMLHttpRequest();
    //}
    //else // code for IE5 and IE6
    //{
    //    xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    //}
    //xhttp.open("GET", "levels/Level1.xml");
    //xhttp.send();
    //xmlDoc = xhttp.responseXML;

    for (var i = 0; i < game.numPlatforms; i++)
    {
        var x;
        var y;
        //var pla;
        if (window.DOMParser)
        {
            parser = new DOMParser();
            xmlDoc = parser.parseFromString(txt, "text/xml");
            x = xmlDoc.getElementsByTagName("x")[i].childNodes[0].nodeValue;
            y = xmlDoc.getElementsByTagName("y")[i].childNodes[0].nodeValue;
            //console.log(x, y);
            game.platforms[game.platforms.length] = new Platform(x,y);
        }
        else // Internet Explorer
        {
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = false;
            xmlDoc.loadXML(txt);
            console.log(txt.length);
        }
    }

}
function init() {

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

    fixDef.shape.SetAsBox((game.screenWidth / SCALE) / 2, (15 / SCALE)  / 2);
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
    if (gameState == GAME)
    {
        game.world.Step(
         1 / 60   //frame-rate
      , 8       //velocity iterations
	  , 3       //position iterations
	  );

        game.world.ClearForces();
        game.player.update();
        
    }
	game.draw();
    //game.world.DrawDebugData();
    //for (var i = 0; i < this.touches.length; i++) {
    //    var touch = this.touches[i];
    //    if (touch.clientX > 0 && touch.clientX < 178 && touch.clientY > 395 && touch.clientY < 479)
    //    {
    //        game.player.move('left');
    //        console.log("Left arrow touched");
    //    }
    //    else if (touch.clientX > 500 && touch.clientX < 678 && touch.clientY > 395 && touch.clientY < 479)
    //    {
    //        game.player.move('right');
    //        console.log("Right arrow touched");
    //    }
    //    else if (touch.clientX > 190 && touch.clientX < 678 && touch.clientY > 395 && touch.clientY < 479)
    //    {
    //        //MAKE THE PLAYER JUMPY JUMP
    //    }
    //}
    requestAnimFrame(game.update);
}

Game.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.screenWidth, this.screenHeight);



    //touches is an array that holds all the touch info
    //use it e.g. draw a circle around each finger
    for (var i = 0; i < this.touches.length; i++) {
        var touch = this.touches[i];
        this.ctx.beginPath();
        this.ctx.fillStyle = "white";
        this.ctx.fillText(" x:" + touch.clientX + " y:" + touch.clientY, touch.clientX + 30, touch.clientY - 30);
        this.ctx.beginPath();
        this.ctx.strokeStyle = "red";
        this.ctx.lineWidth = "6";
        this.ctx.arc(touch.clientX, touch.clientY, 40, 0, Math.PI * 2, true);
        this.ctx.stroke();
    }
    
    if (gameState == GAME)
    {
        this.ctx.drawImage(game.background, -200, 0, 3500, 480);
        for (var i = 0; i < game.numPlatforms; i++) {
            game.platforms[i].draw();
        }
        game.player.draw();
        this.ctx.drawImage(game.jumpButton, game.jumpX, game.jumpY, 298, 57);
        this.ctx.drawImage(game.leftArrow, game.leftArrowX, game.leftArrowY, 178, 84);
        this.ctx.drawImage(game.rightArrow, game.rightArrowX, game.rightArrowY, 178, 84);
    }
    else if(gameState == MENU)
    {
        game.menu.draw();
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
    UITouched();//calls the method to check if the touch occurred within a UI element e.g. jump button
    game.draw();
}
function onTouchEnd(e) {
    game.touches = e.touches;
}

function UITouched()
{
    for (var i = 0; i < this.touches.length; i++) {
        var touch = this.touches[i];
        if (touch.clientX > 0 && touch.clientX < 178 && touch.clientY > 395 && touch.clientY < 479) {
            game.player.move('left');
            console.log("Left arrow touched");
        }
        else if (touch.clientX > 500 && touch.clientX < 678 && touch.clientY > 395 && touch.clientY < 479) {
            game.player.move('right');
            console.log("Right arrow touched");
        }
        else if (touch.clientX > 190 && touch.clientX < 678 && touch.clientY > 395 && touch.clientY < 479) {
            game.player.jump();
        }
    }
}

function keyDownHandler(e) {

    if (e.keyCode == "68")//up 38, 87 D
    {
        game.player.move('right');
    }
    if (e.keyCode == "65")//down 40, 83 A
    {
        game.player.move('left');
        game.audio.play();//MAKE SURE TO REMOVE AS IT IS FUCKING ANNOYING
    }
    if(e.keyCode == "32")
    {
        game.player.jump();
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