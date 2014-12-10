var game;
//http://glasnost.itcarlow.ie/~obroind/Games%20Devices/

//Box2D Variables
var b2Vec2 = Box2D.Common.Math.b2Vec2, b2BodyDef = Box2D.Dynamics.b2BodyDef, b2Body = Box2D.Dynamics.b2Body, b2FixtureDef = Box2D.Dynamics.b2FixtureDef, b2Fixture = Box2D.Dynamics.b2Fixture, b2World = Box2D.Dynamics.b2World
                , b2MassData = Box2D.Collision.Shapes.b2MassData, b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape, b2CircleShape = Box2D.Collision.Shapes.b2CircleShape, b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

var SCALE = 30;

var SPLASH = 0, MENU = 1, GAME = 2;
var gameState;

function main() {
    game = new Game();
    init(); //initalize Box2D world (all object creation must be done after this)
    //listeners
    game.menu = new Menu();
    game.numPlatforms = 10;
    loadLevel();
    game.player = new Player();
    game.platforms = [];
    for (var i = 0; i < game.numPlatforms; i++) {
        game.platforms[game.platforms.length] = new Platform((80 * i) + 1, 300);
    }
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

    requestAnimFrame(game.update); //kickoff the update cycle
}

function loadLevel()
{
    //if (window.XMLHttpRequest) {
    //    xhttp = new XMLHttpRequest();
    //}
    //else // code for IE5 and IE6
    //{
    //    xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    //}

    //xhttp.open("GET", "levels/level1.xml", false);
    //xhttp.send();
    //xmlDoc = xhttp.responseXML;
    //txt = "<bookstore><book>";
    //txt = txt + "<title>Everyday Italian</title>";
    //txt = txt + "<author>Giada De Laurentiis</author>";
    //txt = txt + "<year>2005</year>";
    //txt = txt + "</book></bookstore>";
    txt = "<level1>";
    txt = txt + "<Platform>"
    txt = txt + "<x>50</x>";
    txt = txt + "<y>50</y>";
    txt = txt + "</Platform>"
    txt = txt + "<Platform>"
    txt = txt + "<x>200</x>";
    txt = txt + "<y>50</y>";
    txt = txt + "</Platform>"
    txt = txt + "</level1>";



    if (window.DOMParser) {
        parser = new DOMParser();
        xmlDoc = parser.parseFromString(txt, "text/xml");
        //console.log(txt.split('<bookstore>',20));
        //var cxvdsf = (txt.lastIndexOf('x'));
        //console.log(cxvdsf);
        //console.log(txt[cxvdsf]);
        //console.log(txt.indexOf('x'));
        console.log(txt[21] + txt[22]);
        var test = 0;
        var xmlX = txt[60] + txt[61] + txt[62];
        test = xmlX;
        console.log(test);
        
    }
    else // Internet Explorer
    {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = false;
        xmlDoc.loadXML(txt);
        console.log(txt.length);
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
    bodyDef.position.x = game.screenWidth / 2 / SCALE;
    bodyDef.position.y = 15;
    bodyDef.userData = 'ground';
    fixDef.shape = new b2PolygonShape;

    fixDef.shape.SetAsBox((game.screenWidth / SCALE) / 2, (10 / SCALE) / 2);
    game.world.CreateBody(bodyDef).CreateFixture(fixDef);
    

}; // init()
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
      , 10       //velocity iterations
	  , 10       //position iterations
	  );

        game.world.ClearForces();
		game.player.update();
    }
	game.draw();
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
        for (var i = 0; i < game.numPlatforms; i++) {
            game.platforms[i].draw();
        }
        game.player.draw();
        this.ctx.drawImage(game.jumpButton, 250, 300, 298, 57);
        this.ctx.drawImage(game.leftArrow, 0, 300, 178, 84);
        this.ctx.drawImage(game.rightArrow, 500, 300, 178, 84);
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
    game.draw();
}
function onTouchEnd(e) {
    game.touches = e.touches;
}

function keyDownHandler(e) {

    if (e.keyCode == "68")//up 38, 87 D
    {
        game.player.move('right');
    }
    if (e.keyCode == "65")//down 40, 83 A
    {
        game.player.move('left');
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