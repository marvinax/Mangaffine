var THREE = require('three');
var View = require('./View.js');
var Command = require('./CommandLine.js');

var EditablePath = require('./EditablePath.js');

window.onload = function() {
	View.init($('#viewport').get(0));
	Command.init(View);
	console.log(Command);
	var points = [
		new THREE.Vector3(-10, 0, 0),
		new THREE.Vector3(-10, -10, 0),
		new THREE.Vector3(0, -10, 0),
		new THREE.Vector3(0, 0, 0)
	];
	var path = new EditablePath(points, "zygo");

	View.add(path);
	path.name = "zygo";
	// path.addPoint(new THREE.Vector3(10, 0, 0));
	// path.removePointAt(2);
	path.addPoint(new THREE.Vector3(10, 0, 0));
	path.setEndPointAt(new THREE.Vector3(-20, 0, 0), 0);
	path.setEndPointAt(new THREE.Vector3(20, 0, 0), 2);
	path.setControlPointAt(new THREE.Vector3(-20, -20, 0), 1, 1);
	path.setControlPointAt(new THREE.Vector3(0, -40, 0), 1, -1);
	path.setControlPointAt(new THREE.Vector3(10, -15, 15), 1, -1, true, true);
	path.setControlPointAt(new THREE.Vector3(10, -15, 20), 1, -1, true, true);
	path.setControlPointAt(new THREE.Vector3(20, 15, 0), 2);
	path.setEndPointAt(new THREE.Vector3(0, 10, 0), 1);

	console.log(path.points.map(function(e){return e.x+" "+e.y+" "+e.z}))
	path.removePointAt(1);

}