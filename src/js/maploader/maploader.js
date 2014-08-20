function maploader(map_file){
	this.file = map_file;
	this.json = MyLoadJSON(this, this.file);
	this.image = "";
	this.createMap = function(){
		console.log("[create map]|"+this.file);
		var a_data = Array();
		for (var i=0; i < this.layers.length; i++){
			a_data.push(this.layers[i].data);
		}
		this.map = new Map(this.json.tilewidth,this.json.tileheight);
		this.map.image = game.assets[this.json.tilesets[0].image];
		this.map.loadData(a_data);
		this.map._data = this.map._data[0];
		this.map.collisionData = this.collisionMap;
	},
	//this.layer = this.json.layers.length;
	this.enchantMap = function(){
		console.log("[enchantMap]");
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
		this.spawn = [this.json.properties.spawnX,this.json.properties.spawnY];
	},
	this.enchantTileMap = function(){
		//console.log("[load image]|"+this.json.tilesets[0].image);
		//game.preload(this.json.tilesets[0].image);
		this.image = this.json.tilesets[0].image;
	}

	this.returnMap = function(){
		return this.map;
	}

	this.saveMap = function(){
		//stage.addChild(this.map);
		map = this.map;
	}
}


function MyLoadJSON(map_element, json_file){
	$.getJSON(json_file, function(json) {
		map_element.json = json;
		map_element.enchantMap();
		map_element.enchantTileMap();
		map_element.createMap();
		$(game).trigger("maploaded");
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