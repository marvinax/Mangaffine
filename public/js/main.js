var THREE = require('three');
var ThreeViewport = require('./ThreeViewport.js');

window.onload = function() {
	$('#viewport').height(window.innerHeight).width(window.innerWidth);
	$('#command-line').focus();
	ThreeViewport.init($('#viewport').get(0));
	ThreeViewport.add(new THREE.Mesh(new THREE.BoxGeometry(5, 5, 5), new THREE.MeshLambertMaterial()));
}