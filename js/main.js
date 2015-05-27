window.onload = function() {
	$('#viewport').height(window.innerHeight).width(window.innerWidth);
	$('#command-line').focus();
	three = new ThreeViewport('viewport');
}