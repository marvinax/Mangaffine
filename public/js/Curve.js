var THREE = require('three');
var ForwardDiffBezier = require('./ForwardDiffBezier.js');

/**
 * [Curve description]
 * @param {[type]} points [description]
 */

Curve = function(points){
	THREE.Object3D.call( this );
	this.type = "Curve";
	this.points = points;

	var curve = new THREE.Line(new THREE.Geometry(), new THREE.LineBasicMaterial());
		curve.geometry.vertices = ForwardDiffBezier(this.points);
		curve.geometry.verticesNeedUpdate = true;
		curve.material.color = 0x7F7F7F;
		curve.material.lineWidth = 1.5;

	this.add(curve);
}

Curve.prototype = Object.create( THREE.Object3D.prototype );
Curve.prototype.constructor = Curve;

Curve.prototype.set = function(which, point){
	this.points[which] = point;
	this.children[0].geometry.vertices = ForwardDiffBezier(this.points);
	this.children[0].geometry.verticesNeedUpdate = true;
}

Curve.prototype.dispose = function(){
	this.children[0].geometry.dispose();
	this.children[0].material.dispose();
	this.remove(this.children[0]);
	delete this.points;
	delete this.vertices;
}

module.exports = Curve;