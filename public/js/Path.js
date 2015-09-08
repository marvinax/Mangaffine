var THREE = require('three');
var Curve = require('./Curve.js');

Path = function(points){
	THREE.Object3D.call( this );

	this.points = points;

	for (var i = 3; i < points.length; i+=3){
		this.add(new Curve(this.points.slice(i-3, i+1)));
	}
}

Path.prototype = Object.create( THREE.Object3D.prototype );
Path.prototype.constructor = Path;

Path.prototype.addPoint = function(point){
	var len = this.points.length;

	this.points.push(point.clone(), point.clone(), point.clone());
	this.add(new Curve(this.points.slice(this.points.length - 4)));
}

Path.prototype.removePointAt = function(pointIndex){

	var index = Math.floor(pointIndex / 3);

	// index is within the range of (0, (this.points.length - 1) / 3 * 2 + 1)
	if (index == 0){
		this.points.splice(0, 3);
		this.remove(this.children[0]);
	} else if (index == this.children.length){
		this.points.splice(this.points.length - 3, 3);
		this.remove(this.children[index-1]);
	} else {
		this.points.splice(index * 3 - 1, 3);
		this.remove(this.children[index]);
		this.children[index-1].set(2, this.points[index*3-1]);
		this.children[index-1].set(3, this.points[index*3]);
	}
}

Path.prototype.setPointAt = function(point, index){

	var curveIndex = Math.floor(index / 3),
		pointIndex = index % 3;

	this.points[index].copy(point);
	if(curveIndex < this.children.length){
		this.children[curveIndex].set(pointIndex, point);
	}

	if(curveIndex > 0 && pointIndex == 0){
		this.children[curveIndex-1].set(3, point);
	}
}

Path.prototype.setDualOf = function(index, ratio){

	var thisIndex = index % 3;

	if(thisIndex == 0){
		return;
	}

	var pointIndex = (thisIndex - 1) * 3 + ( index - thisIndex );
	var whichNeighbor = (thisIndex * 2 - 3);
	var dualIndex = pointIndex + whichNeighbor;

	var difference = new THREE.Vector3();
		difference.subVectors(this.points[pointIndex], this.points[thisIndex]);
		difference.multiplyScalar(ratio);
		
	this.points[dualIndex].addVectors(this.points[pointIndex], difference);

	this.children[Math.floor(index/3)+whichNeighbor].set( 3 - thisIndex, this.points[dualIndex]);

	return dualIndex;
}


module.exports = Path;