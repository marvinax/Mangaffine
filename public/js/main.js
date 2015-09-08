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
	path.addPoint(new THREE.Vector3(10, 0, 0));
	path.setDualOf(2, 3);
	path.setPointAt(new THREE.Vector3(-20, 0, 0), 0);
	path.setPointAt(new THREE.Vector3(20, 0, 0), 6);
	path.setPointAt(new THREE.Vector3(-20, -20, 0), 4);
	path.setPointAt(new THREE.Vector3(0, -40, 0), 2);
	path.setPointAt(new THREE.Vector3(10, -15, 15), 2);
	path.setPointAt(new THREE.Vector3(10, -15, 20), 4);
	path.setPointAt(new THREE.Vector3(20, 15, 0), 6);
	path.setPointAt(new THREE.Vector3(0, 10, 0), 1);

	path.removePointAt(3);

}