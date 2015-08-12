var ThreeViewport = require('./ThreeViewport.js');

window.onload = function() {
	$('#viewport').height(window.innerHeight).width(window.innerWidth);
	$('#command-line').focus();
	ThreeViewport.init('viewport');
}