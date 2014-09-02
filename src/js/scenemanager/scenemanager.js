function scenemanager(){
	this.this_set = {};
	this.next_set = {};
	this.last_set = {};
    this.maploader = new maploader();
    this.newmap_loadeing = false;

    this.startmap = function(new_mapfile){
        this.maploader.loadMap(new_mapfile);
    }

    this.buildscene = function(){
    	var stage = new Group();
    	var scene = new Scene();

        player = generatePlayer(this.maploader);

    	stage.addChild(this.maploader.map);
        stage.addChild(player);
        if (this.maploader.map0){
            //console.log("SCENEMANAGER|[debug|buildscene|map0]");
            stage.addChild(this.maploader.map0);
        }
        //group.addChild(foregroundMap);
        //game.rootScene.addChild(group);
        //scene = new Scene();
        scene.addChild(stage);

        //game.pushScene(scene);
        this.next_set = {"scene": scene,"stage":stage};
    }

    this.onportal = function(new_mapfile){
        console.log("SCENEMANAGER|[event]|onportal");
        this.newmap_loadeing = true;
        this.startmap(new_mapfile);
    }

    this.onmaploaded = function(){
        console.log("SCENEMANAGER|[event]|onmaploaded");
        this.buildscene();
        this.last_set = this.this_set;
        this.this_set = this.next_set;
        this.next_set = {};

        game.removeScene(this.last_set.scene);
        game.pushScene(this.this_set.scene);

        this.last_set = {};

        this.newmap_loadeing = false;
        
        $(game).trigger("sceneloaded",[this]);
    }

    $(this).bind("gametick",function(){
        for (key in this.maploader.portal){
            if (( player.x >= this.maploader.portal[key].x*16-16 && player.x <= this.maploader.portal[key].x*16) && ( player.y >= this.maploader.portal[key].y*16-16 && player.y < this.maploader.portal[key].y*16 ) && !this.newmap_loadeing){
                console.log("player on portal|key:"+key+"|s:"+this.maploader.portal[key].s);
                this.onportal(this.maploader.portal[key].s);
            }
        }
    });

    //$(this).bind("maploaderready",this.onmaploaded);
}
