var THREE = require('three');
var View = require('./View.js');
var EditablePath = require('./EditablePath.js');

window.onload = function() {
	View.init($('#viewport').get(0));

	var points = [
		new THREE.Vector3(-10, 0, 0),
		new THREE.Vector3(-10, -10, 0),
		new THREE.Vector3(0, -10, 0),
		new THREE.Vector3(0, 0, 0)
	];
	var path = new EditablePath(points, "Now you could assign curve a name.");
	View.add(path);

	path.addPoint(new THREE.Vector3(10, 0, 0));
	path.removePointAt(2);
	path.addPoint(new THREE.Vector3(10, 0, 0));
	path.setEndPointAt(new THREE.Vector3(-20, 0, 0), 0);
	path.setEndPointAt(new THREE.Vector3(20, 0, 0), 2);
	path.setControlPointAt(new THREE.Vector3(-20, -20, 0), 1, 1);
	path.setControlPointAt(new THREE.Vector3(0, -40, 0), 1, -1);
	path.setControlPointAt(new THREE.Vector3(10, -15, 15), 1, -1, true, true);
	path.setControlPointAt(new THREE.Vector3(10, -15, 20), 1, -1, true, true);
	path.setControlPointAt(new THREE.Vector3(20, 15, 0), 2);
	path.setEndPointAt(new THREE.Vector3(0, 10, 0), 1);
}