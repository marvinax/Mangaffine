var THREE = require('three');
var ThreeViewport = require('./ThreeViewport.js');

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

var circle1 = new THREE.Line(centerGeom(), line1),
	circle2 = new THREE.Line(centerGeom(), line2),
	circle3 = new THREE.Line(centerGeom(), line3);


window.onload = function() {
	$('#viewport').height(window.innerHeight).width(window.innerWidth);
	$('#command-line').focus();
	ThreeViewport.init($('#viewport').get(0));

	circle2.rotation.x = Math.PI / 2;
	circle3.rotation.y = Math.PI / 2;

	ThreeViewport.add(circle1);
	ThreeViewport.add(circle2);
	ThreeViewport.add(circle3);
}