var THREE = require('three');
var Curve = require('./Curve.js');

Path = function(points){
	THREE.Object3D.call( this );

	for (var i = 3; i < points.length; i+=3){
		this.add(new Curve(points.slice(i-3, i+1)));
	}
}

Path.prototype = Object.create( THREE.Object3D.prototype );
Path.prototype.constructor = Path;

Path.prototype.addPoint = function(point){

	var len = this.children.length,
		last = this.children[len-1].points[3];
	this.add(new Curve([last.clone(), point.clone(), point.clone(), point.clone()]));
}

Path.prototype.removePoint = function(){
	this.remove(this.children[0]);
}

Path.prototype.setPointAt = function(point, index){

	var curveIndex = Math.floor(index / 3),
		pointIndex = index % 3;

	this.points[index].copy(point);
	this.update(this.points);
}

Path.prototype.update = function(points){
	var curveIndex, pointIndex;

	points.forEach(function(p, i){
		curveIndex = Math.floor(i / 3);
		pointIndex = i % 3;

		if(curveIndex < this.children.length){
			this.children[curveIndex].set(pointIndex, p);
		}

		if(curveIndex > 0 && pointIndex == 0){
			this.children[curveIndex-1].set(3, p);
		}	
	}.bind(this));

}

module.exports = Path;