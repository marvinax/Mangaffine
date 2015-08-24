var THREE = require('three');
var View = require('./View.js');
var Curve = require('./Curve.js');
var Path = require('./Path.js');

var line1 = new THREE.LineBasicMaterial({
		opacity : 0.7,
		lineWidth : 3,
		color : 0xE11C51
	}),
	line2 = new THREE.LineBasicMaterial({
		opacity : 0.7,
		lineWidth : 3,
		color : 0xF85D1F
	}),
	line3 = new THREE.LineBasicMaterial({
		opacity : 0.7,
		lineWidth : 3,
		color : 0xAC159A
	});


var centerGeom = function(){
	var geom = new THREE.CircleGeometry(10, 50);
	geom.vertices.shift();
	return geom;
}

var ring1 = new THREE.Line(centerGeom(), line1),
	ring2 = new THREE.Line(centerGeom(), line2),
	ring3 = new THREE.Line(centerGeom(), line3);

window.onload = function() {
	View.init($('#viewport').get(0));
	// Control.init(View);

	ring2.rotation.x = Math.PI / 2;
	ring3.rotation.y = Math.PI / 2;

	// View.scene.add(ring1, ring2, ring3);

	var path = Path();
		path.init();
		path.add(new THREE.Vector3( 5, 0, 0 ));
		path.add(new THREE.Vector3( 5, 10, 0 ));
		path.addLast(new THREE.Vector3(5, 20, 0));

		path.edit(0, new THREE.Vector3(10, 0, 0));
		path.edit(1, new THREE.Vector3(-10, 0, 0));
		path.edit(2, new THREE.Vector3(10, 0, 0));

	View.add(path.path, "docs");
	// console.log(View.sketch.children)
}