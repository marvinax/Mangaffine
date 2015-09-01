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
	var lastTangent = this.points[len-1].clone();
		lastTangent.subVectors(this.points[len-1], this.points[len-2]);
	this.points.push(this.points[len-1].clone().add(lastTangent), point.clone(), point.clone());
	this.add(new Curve(this.points.slice(this.points.length - 4)));
}

Path.prototype.removePointAt = function(index){
	// index is within the range of (0, (this.points.length - 1) / 3 * 2 + 1)
	if (index == 0){
		this.points.splice(0, 3);
		this.remove(this.children[0]);
	} else if (index == this.children.length){
		this.points.splice(this.points.length - 3, 3);
		this.remove(this.children[index-1]);
	} else {
		this.points.splice((index - 1) * 3, 3);
		this.remove(this.children[index]);
		this.children[index-1].set(2, this.points[index*3-1]);
		this.children[index-1].set(3, this.points[index*3]);
	}
}

Path.prototype.setEndPointAt = function(point, index){
	var move = point.clone();

	if(index == 0){
		move.sub(this.points[0]);
		this.points[1].add(move);
		this.points[0] = point;
		this.children[0].set(0, this.points[0]);
		this.children[0].set(1, this.points[1]);
	} else if (index == this.children.length){
		move.sub(this.points[index*3]);
		this.points[index*3-1].add(move);
		this.points[index*3] = point;
		this.children[index-1].set(3, this.points[index*3]);
		this.children[index-1].set(2, this.points[index*3-1]);
	} else {
		move.sub(this.points[index*3]);
		this.points[index*3-1].add(move);
		this.points[index*3+1].add(move);
		this.points[index*3] = point;
		this.children[index-1].set(3, this.points[index*3]);
		this.children[index-1].set(2, this.points[index*3-1]);
		this.children[index].set(0, this.points[index*3]);
		this.children[index].set(1, this.points[index*3+1]);
	}
}

Path.prototype.setControlPointAt = function(point, index, which, directionLocked, ratioLocked){
	var len = this.points.length;
	var dist = new THREE.Vector3();

	if (index == 0){
		this.points[1] = point;
		this.children[index].set(1, this.points[1]);
	} else if (index === this.children.length){
		this.points[index * 3 - 1] = point;
		this.children[index-1].set(2, this.points[index*3-1]);
	} else {

		if(ratioLocked){
			var ratio = this.points[index*3].distanceTo(this.points[index*3 - which])/this.points[index*3].distanceTo(this.points[index*3 + which]);
		}
		this.points[index * 3 + which] = point;
		this.children[index - ((which == 1) ? 0 : 1)].set((which == 1 ? 1 : 2), this.points[index*3+which]);
		dist.subVectors(this.points[index*3+which], this.points[index*3]);
		
		if(directionLocked){

			this.points[index * 3 - which].subVectors(this.points[index*3], dist);

			if(ratioLocked){
				this.points[index * 3 - which].multiplyScalar(ratio);
			}
			this.children[index - ((which == 1) ? 1 : 0)].set((which == 1 ? 2 : 1), this.points[index*3-which]);
		}
	}
}



module.exports = Path;