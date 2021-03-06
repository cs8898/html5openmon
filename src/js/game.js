enchant();
var game = {};
var stage = {};
//var scene = {};
var player = {};
//var map1 = {};
//var maploader1 = {};
var scenemanager1 = {};

window.onload = function() {
    game = new Game(320,320);
    game.fps = 15;
    game.preload('img/tile/chara0.gif');

    scenemanager1 = new scenemanager();    
    //maploader1 = new maploader('map1.json');
    scenemanager1.startmap("map1.json");
    $(game).bind("sceneloaded",this.onsceneloaded);

    game.start();
};

function onsceneloaded(event,scenemanager_inst){
    //var maploader_inst = event.data.maploader;
    //game.onload = function() {

        //stage = new Group();

        //maploader1.map.image = game.assets[maploader1.image];
        
    //};
    //console.log(event);
    //console.log(scenemanager_inst);
    console.log("GAME|[event]|onsceneloaded");
    game.currentScene.addEventListener('enterframe',function(){

        var x = Math.min((game.width  - 16) / 2 - player.x, 0);
        var y = Math.min((game.height - 16) / 2 - player.y, 0);
        x = Math.max(game.width,  x + scenemanager_inst.maploader.map.width)  - scenemanager_inst.maploader.map.width;
        y = Math.max(game.height, y + scenemanager_inst.maploader.map.height) - scenemanager_inst.maploader.map.height;
        scenemanager_inst.this_set.stage.x = x;
        scenemanager_inst.this_set.stage.y = y;

        if (game.input.a || game.input.b){
            for (key in game.input){
                if ((key == "a" || key == "b") && game.input[key]){
                    console.log(key+"|"+game.input[key]);
                    navigator.vibrate(100);
                }
            }
        }

        $(scenemanager_inst).trigger('gametick');
    });

    setTimeout('genearatePad();',100);

    //game.start();
}


function generatePlayer(maploader_inst){
    console.log("GAME|[function]|generatePlayer");
    player = new Sprite(32, 32);
    player.x = maploader_inst.spawn.x * 16 - 8;
    player.y = maploader_inst.spawn.y * 16;
    var playerImage = new Surface(96, 128);
    playerImage.draw(game.assets['img/tile/chara0.gif'], 0, 0, 96, 128, 0, 0, 96, 128);
    player.image = playerImage;

    player.isMoving = false;
    player.direction = 0;
    player.walk = 1;
    player.firstStep = 0;
    //player.isLocked = false;

    player.addEventListener('enterframe', function() {
        this.frame = this.direction * 3 + this.walk;
        if (this.isMoving) {
            this.moveBy(this.vx, this.vy);
 
            if (!(game.frame % 3)) {
                this.walk++;
                this.walk %= 3;
            }
            if ((this.vx && (this.x-8) % 16 == 0) || (this.vy && this.y % 16 == 0)) {
            //if ((this.vx && (this.x-16) % 32 == 0) || (this.vy && this.y % 32 == 0)) {
                this.isMoving = false;
                player.firstStep = 0;
                this.walk = 1;
            }
        } else {//if(!player.isLocked)
            this.vx = this.vy = 0;
            if (game.input.left) {
                if (player.firstStep >= game.fps/2 || this.direction == 1)
                    this.vx = -4;
                player.firstStep += 1;
                this.direction = 1;
            } else if (game.input.right) {
                if (player.firstStep >= game.fps/2 || this.direction == 2)
                    this.vx = 4;
                player.firstStep += 1;
                this.direction = 2;
            } else if (game.input.up) {
                if (player.firstStep >= game.fps/2 || this.direction == 3)
                    this.vy = -4;
                player.firstStep += 1;
                this.direction = 3;
            } else if (game.input.down) {
                if (player.firstStep >= game.fps/2 || this.direction == 0)
                    this.vy = 4;
                player.firstStep += 1;
                this.direction = 0;
            }

            if ( this.vx || this.vy ) {
                var x = this.x + (this.vx ? this.vx / Math.abs(this.vx) * 16 : 0) + 16;
                var y = this.y + (this.vy ? this.vy / Math.abs(this.vy) * 16 : 0) + 16;
                //var x = this.x + (this.vx ? this.vx / Math.abs(this.vx) * 32 : 0) + 32;
                //var y = this.y + (this.vy ? this.vy / Math.abs(this.vy) * 32 : 0) + 32;
                if (0 <= x && x < maploader_inst.map.width && 0 <= y && y < maploader_inst.map.height && !maploader_inst.map.hitTest(x, y)) {
                    this.isMoving = true;
                    arguments.callee.call(this);
                }
            }
        }
    });
    return player;
}

function genearatePad(){
    console.log("GAME|[function]|genearatePad");
    /*var pad = new Pad();
    pad.x = 0;
    pad.y = 220;
    game.currentScene.addChild(pad);
    //game.rootScene
    */

    windowAbsPad();


    var gbutton = new GButton();
    gbutton.x = game.width - (74+25);
    gbutton.y = 220 + 32;
    game.currentScene.addChild(gbutton);

}

function windowAbsPad(){
    var _detectInput = function (lx,ly){
        if (lx < game.width/2 - 16*4 && ly > game.height/2-4*16 && ly < game.height/2+4*16){
            //console.log("left");
            game.changeButtonState("left", true);
            game.changeButtonState("right", false);
            game.changeButtonState("up", false);
            game.changeButtonState("down", false);
        }else
        if (lx > game.width/2 + 16*4 && ly > game.height/2-4*16 && ly < game.height/2+4*16){
            //console.log("right");
            game.changeButtonState("left", false);
            game.changeButtonState("right", true);
            game.changeButtonState("up", false);
            game.changeButtonState("down", false);
        }else
        if (ly < game.height/2 - 16*4 && lx > game.width/2-4*16 && lx < game.width/2+4*16){
            //console.log("up");
            game.changeButtonState("left", false);
            game.changeButtonState("right", false);
            game.changeButtonState("up", true);
            game.changeButtonState("down", false);
        }else
        if (ly > game.height/2 + 16*4 && lx > game.width/2-4*16 && lx < game.width/2+4*16){
            //console.log("down");
            game.changeButtonState("left", false);
            game.changeButtonState("right", false);
            game.changeButtonState("up", false);
            game.changeButtonState("down", true);
        }else{
            game.changeButtonState("left", false);
            game.changeButtonState("right", false);
            game.changeButtonState("up", false);
            game.changeButtonState("down", false);
        }
        //player.x = lx;
        //player.y = ly;
    }
    game.currentScene.addEventListener('touchstart', function(e) {
       _detectInput(e.localX, e.localY);
    });
    game.currentScene.addEventListener('touchmove', function(e) {
        _detectInput(e.localX, e.localY);
    });
    game.currentScene.addEventListener('touchend', function(e) {
        game.changeButtonState("left", false);
        game.changeButtonState("right", false);
        game.changeButtonState("up", false);
        game.changeButtonState("down", false);
    });
}
