var THREE = require('three');

TextLabelCloud = function(points){
	THREE.Object3D.call(this);

	this.points = points;
	console.log(this.points);
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

	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');
	var metrics = context.measureText( message );
	var textWidth = metrics.width;

	context.fillStyle = "rgba(0, 0, 0, 1.0)";
	context.font = "lighter 40px Helvetica Neue"
	context.fillText( message, textWidth+150, 40*1.4);
	
	// canvas contents will be used for a texture
	var texture = new THREE.Texture(canvas) 
	texture.needsUpdate = true;

	var spriteMaterial = new THREE.SpriteMaterial( { map: texture} );
	var sprite = new THREE.Sprite( spriteMaterial );
	sprite.scale.set(10,-5,-1.0);
	sprite.position.copy(point);
	return sprite;	
}

module.exports = TextLabelCloud;