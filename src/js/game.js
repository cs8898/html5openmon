enchant();
var game = {};
var stage = {};
//var scene = {};
//var player = {};
//var map1 = {};
//var maploader1 = {};
var scenemanager1 = {};

window.onload = function() {
    game = new Game(320, 320);
    game.fps = 15;
    game.preload('img/tile/map1.gif', 'img/tile/chara0.gif');

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
    game.currentScene.addEventListener('enterframe',function(){

        var x = Math.min((game.width  - 16) / 2 - player.x, 0);
        var y = Math.min((game.height - 16) / 2 - player.y, 0);
        x = Math.max(game.width,  x + scenemanager_inst.maploader.map.width)  - scenemanager_inst.maploader.map.width;
        y = Math.max(game.height, y + scenemanager_inst.maploader.map.height) - scenemanager_inst.maploader.map.height;
        stage.x = x;
        stage.y = y;

        if (game.input.a || game.input.b){
            for (key in game.input){
                if ((key == "a" || key == "b") && game.input[key])
                    console.log(key+"|"+game.input[key]);
            }
        }

        $(scenemanager_inst).trigger("gametick");
    });

    //game.start();
}


function generatePlayer(maploader_inst){
    var player = new Sprite(32, 32);
    player.x = maploader_inst.spawn.x * 16 - 8;
    player.y = maploader_inst.spawn.y * 16;
    var playerImage = new Surface(96, 128);
    playerImage.draw(game.assets['img/tile/chara0.gif'], 0, 0, 96, 128, 0, 0, 96, 128);
    player.image = playerImage;

    player.isMoving = false;
    player.direction = 0;
    player.walk = 1;
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
                this.walk = 1;
            }
        } else {
            this.vx = this.vy = 0;
            if (game.input.left) {
                this.direction = 1;
                this.vx = -4;
            } else if (game.input.right) {
                this.direction = 2;
                this.vx = 4;
            } else if (game.input.up) {
                this.direction = 3;
                this.vy = -4;
            } else if (game.input.down) {
                this.direction = 0;
                this.vy = 4;
            }
            if (this.vx || this.vy) {
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

function genearatePad(maploader_inst){
    var pad = new Pad();
        pad.x = 0;
        pad.y = 220;
        game.currentScene.addChild(pad);
        //game.rootScene


        var gbutton = new GButton();
        gbutton.x = game.width - (74+25);
        gbutton.y = 220 + 32;
        game.currentScene.addChild(gbutton);

}