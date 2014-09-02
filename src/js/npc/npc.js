function npc(x,y,r){
	var obj = new Sprite(32, 32);
    obj.x = 16*x-8;
    obj.y = 16*y;
    obj.range = 16*r;
    var playerImage = new Surface(96, 128);
    playerImage.draw(game.assets['img/tile/chara0.gif'], 0, 0, 96, 128, 0, 0, 96, 128);
    obj.image = playerImage;

    obj.isMoving = false;
    obj.direction = 1;
    obj.walk = 1;

    obj.addEventListener('enterframe', function() {
    	obj.frame = obj.direction*3+obj.walk;

    	if (obj.direction == 0){
    		if(obj.x == player.x && obj.y < player.y && Math.abs(obj.x - player.x) <= obj.range)
    			obj.locked = true;
    	} else if (obj.direction == 1){
    		if(obj.x > player.x && obj.y == player.y && Math.abs(obj.x - player.x) <= obj.range)
    			obj.locked = true;
    	} else if (obj.direction == 2){
    		if(obj.x < player.x && obj.y == player.y && Math.abs(obj.x - player.x) <= obj.range)
    			obj.locked = true;
    	} else if (obj.direction == 3){
    		if(obj.x == player.x && obj.y > player.y && Math.abs(obj.x - player.x) <= obj.range)
    			obj.locked = true;
    	}

    	if (obj.locked){
    		console.log("NPC|[locked]|true");
    		player.isLocked = true;
    		//obj.locked = false;
    	}
    });
    return obj
}
