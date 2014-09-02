function maploader(map_file){
	if (map_file){
		this.file = map_file;
		this.json = MyLoadJSON(this, this.file);
	}
	this.loadMap = function(map_file){
		this.file = map_file;
		this.json = MyLoadJSON(this,this.file);
	}
	this.image = "";
	this.createMap = function(){
		console.log("MAPLOADER|[create map]|"+this.file);
		var a_data = Array();
		var a_end = this.layers.length;
		if( this.toplayer > 0){
			a_end = this.toplayer;
		}
		//console.log("MAPLOADE|[debug|create map]|a_end="+a_end);
		for (var i = 1; i < a_end; i++){
			//console.log("MAPLOADE|[debug|create map|a]|i="+i);
			a_data.push(this.layers[i].data);
		}
		this.map = new Map(this.json.tilewidth,this.json.tileheight);
		this.map.image = game.assets[this.image];
		this.map.loadData(a_data);
		this.map._data = this.map._data[0];
		this.map.collisionData = this.collisionMap;

		this.map0 = undefined;
		if( this.toplayer > 0){
			var b_data = Array();
			for(var i = this.toplayer; i < this.layers.length; i++){
				//console.log("MAPLOADE|[debug|create map|b]|i="+i);
				b_data.push(this.layers[i].data);
			}

			this.map0 = new Map(this.json.tilewidth,this.json.tileheight);
			this.map0.image = game.assets[this.image];
			this.map0.loadData(b_data);
			this.map0._data = this.map0._data[0];
		}

		$(scenemanager1).trigger("maploaded");
	}
	//this.layer = this.json.layers.length;
	this.enchantMap = function(){
		console.log("MAPLOADER|[enchant map]|"+this.file);
		this.layers = this.json.layers;
		this.collisionMap = new Array();
		for (var i = 0; i < this.layers.length; i++){
			for (var a = 0; a < this.layers[i].data.length; a++){
				this.layers[i].data[a] -= 1;
			}
			this.layers[i].data = this.layers[i].data.chunk(this.json.width);
		}
		for (var a = 0; a < this.layers[0].data.length; a++){
			this.collisionMap.push([]);
			for (var b = 0; b < this.layers[0].data[a].length; b++){
				if ( this.layers[0].data[a][b] == -1 ){
					this.collisionMap[a].push(0);
				} else {
					this.collisionMap[a].push(1);
				}
			}
		}
		this.spawn = JSON.parse(this.json.properties.spawn);
		this.portal = JSON.parse(this.json.properties.portal);
		this.toplayer = parseInt(this.json.properties.toplayer);
	},
	this.enchantTileMap = function(){
		this.image = this.json.tilesets[0].image;
		console.log("MAPLOADER|[load image]|"+this.image);
		if (!game.assets[this.image]){
			var maploader_obj = this;
			game.load(this.image,function(){
				maploader_obj.createMap();
				maploader_obj = undefined;
			});
		} else {
			this.createMap();
		}
	}

	this.returnMap = function(){
		return this.map;
	}
}


function MyLoadJSON(map_element, json_file){
	$.getJSON(json_file, function(json) {
		map_element.json = json;
		map_element.enchantMap();
		map_element.enchantTileMap();
		//map_element.createMap();
		//map_element.draw();
	});
}

Array.prototype.chunk = function(chunkSize) {
    var array=this;
    return [].concat.apply([],
        array.map(function(elem,i) {
            return i%chunkSize ? [] : [array.slice(i,i+chunkSize)];
        })
    );
}
