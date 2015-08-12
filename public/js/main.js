var THREE = require('three');
var ThreeViewport = require('./ThreeViewport.js');

var lineMaterial = new THREE.MeshBasicMaterial({
	color : 0x000000
})

var centerGeom = function(){
	var geom = new THREE.CircleGeometry(20, 50);
	geom.vertices.shift();
	return geom;
}

window.onload = function() {
	$('#viewport').height(window.innerHeight).width(window.innerWidth);
	$('#command-line').focus();
	ThreeViewport.init($('#viewport').get(0));
	ThreeViewport.add(new THREE.Line(centerGeom(), lineMaterial));
}