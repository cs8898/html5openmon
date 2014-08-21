function scenemanager(){
	this.this_scene = {};
	this.next_scene = {};
	this.last_scene = {};
    this.maploader = new maploader();

    this.startmap = function(new_mapfile){
        this.maploader.loadMap(new_mapfile);
    }

    this.buildscene = function(){
    	var group = new Group();
    	var scene = new Scene();

        player = generatePlayer(this.maploader);

    	group.addChild(this.maploader.map);
        group.addChild(player);
        //group.addChild(foregroundMap);
        //game.rootScene.addChild(group);
        //scene = new Scene();
        scene.addChild(group);

        //game.pushScene(scene);
        this.next_scene = scene;
    }

    this.onportal = function(new_mapfile){
        this.maploader.loadMap(new_mapfile);
    }

    this.onmaploaded = function(){
        this.buildscene();
        this.last_scene = this.this_scene;
        this.this_scene = this.next_scene;
        this.next_scene = {};

        game.removeScene(this.last_scene);
        game.pushScene(this.this_scene);

        this.last_scene = {};

        $(game).trigger("sceneloaded",[this]);
    }

    $(this).bind("gametick",function(){
        for (key in this.maploader.portal){
            if (( player.x >= this.maploader.portal[key].x*16-16 && player.x <= this.maploader.portal[key].x*16) && ( player.y >= this.maploader.portal[key].y*16-16 && player.y < this.maploader.portal[key].y*16 )){
                console.log("player on portal|key:"+key+"|s:"+this.maploader.portal[key].s);
                this.onportal(this.maploader.portal[key].s);
            }
        }
    });

    $(this).bind("maploaded",this.onmaploaded);
}