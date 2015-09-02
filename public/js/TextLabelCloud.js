var THREE = require('three');

TextLabelCloud = function(points){
	THREE.Object3D.call(this);

	this.canvas = document.createElement('canvas');
	this.context = this.canvas.getContext('2d');

	this.points = points;

	this.points.forEach(function(e, i){
		this.add(this.makeTextLabel(i, e));
	}.bind(this))

}

TextLabelCloud.prototype = Object.create(THREE.Object3D.prototype);
TextLabelCloud.prototype.constructor = TextLabelCloud;

TextLabelCloud.prototype.updatePoints = function(){
	this.removeAll();
}

TextLabelCloud.prototype.addTextLabel = function(message, point){
	this.add(this.makeTextLabel(message, point));
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

	var spriteMaterial = new THREE.SpriteMaterial( { map: texture} );
	var sprite = new THREE.Sprite( spriteMaterial );
	sprite.scale.set(10,-5,-1.0);
	sprite.position.copy(point);
	return sprite;	
}

module.exports = TextLabelCloud;