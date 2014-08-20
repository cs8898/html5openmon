enchant();
var game = {};
var stage = {};
var map1 = {};
var map = {};

window.onload = function() {
    game = new Game(320, 320);
    game.fps = 15;
    game.preload('img/tile/map1.gif', 'img/tile/chara0.gif');
    
    //game.onload = function() {    
    map1 = new maploader('map1.json');
    //map1.draw();
    //};

    $(game).bind("maploaded",onMapLoaded);
    //$(game).trigger("maploaded");
};

function onMapLoaded(){
    game.onload = function() {

        map = map1.returnMap();
        map.image = game.assets[map1.image];

        var player = new Sprite(32, 32);
        player.x = map1.spawn[0] * 16 - 8;
        player.y = map1.spawn[1] * 16;
        var image = new Surface(96, 128);
        image.draw(game.assets['img/tile/chara0.gif'], 0, 0, 96, 128, 0, 0, 96, 128);
        player.image = image;

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
                    if (0 <= x && x < map.width && 0 <= y && y < map.height && !map.hitTest(x, y)) {
                        this.isMoving = true;
                        arguments.callee.call(this);
                    }
                }
            }
        });

        stage = new Group();
        stage.addChild(map);
        stage.addChild(player);
        //stage.addChild(foregroundMap);
        game.rootScene.addChild(stage);

        var pad = new Pad();
        pad.x = 0;
        pad.y = 220;
        game.rootScene.addChild(pad);

        game.rootScene.addEventListener('enterframe', function(e) {
            var x = Math.min((game.width  - 16) / 2 - player.x, 0);
            var y = Math.min((game.height - 16) / 2 - player.y, 0);
            x = Math.max(game.width,  x + map.width)  - map.width;
            y = Math.max(game.height, y + map.height) - map.height;
            stage.x = x;
            stage.y = y;
        });
    };

    game.start();
}