var THREE = require('three');

TextLabelCloud = function(points){
	THREE.Object3D.call(this);
	var _this = this;


	this.canvas = document.createElement('canvas');
	this.context = this.canvas.getContext('2d');

	points.forEach(function(e, i){
		if(i % 3 == 0)
			_this.addLabel(i / 3, e);
	})

}

TextLabelCloud.prototype = Object.create(THREE.Object3D.prototype);
TextLabelCloud.prototype.constructor = TextLabelCloud;

TextLabelCloud.prototype.addLabel = function(message, point){
	this.add(this.makeTextLabel(message, point));
}

TextLabelCloud.prototype.removeLabelAt = function(index){
	var len = this.children.length;
	for(var i = len - 1; i > index; i--){
		this.children[i-1].position.copy(this.children[i].position);
	}
	this.remove(this.children[len - 1]);
}

TextLabelCloud.prototype.addIndexLabel = function(point){
	this.add(this.makeTextLabel(this.children.length, point));
}

TextLabelCloud.prototype.setLabelPositionAt = function(point, index){
		this.children[index].position.copy(point);
}

TextLabelCloud.prototype.makeTextLabel = function( message, point ) {
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

	var metrics = this.context.measureText( message );
	var textWidth = metrics.width;

	this.context.fillStyle = "rgba(0, 0, 0, 1.0)";
	this.context.font = "lighter 40px Helvetica Neue"
	this.context.fillText( message, textWidth+150, 40*1.4);

	var image = new Image();
	image.src = this.canvas.toDataURL();
	
	var texture = new THREE.Texture();
	texture.image = image;
	texture.needsUpdate = true;
	texture.minFilter = THREE.LinearFilter;
	var spriteMaterial = new THREE.SpriteMaterial( { map: texture} );

	var sprite = new THREE.Sprite( spriteMaterial );
	sprite.scale.set(10,-5,-1.0);
	sprite.position.copy(point);
	return sprite;	
}

module.exports = TextLabelCloud;