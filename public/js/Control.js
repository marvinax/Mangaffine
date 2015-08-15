var THREE = require('three');

var pointMaterial = new THREE.PointCloudMaterial({
	size : 20,
	color : 0xef049d
});

module.exports = (function(){

	// For capturing the mouse coord over the screen
	// and unproject to 3D model.
	var	raycaster = new THREE.Raycaster(),
		mouse = new THREE.Vector2();
	
	var rndr, ctrl, scene, camera, canvasElement;

	var intersect = function(event){
		mouse.x = ( 2*event.clientX / rndr.domElement.width ) * 2 - 1;
		mouse.y = - ( 2*event.clientY / rndr.domElement.height ) * 2 + 1;
		raycaster.setFromCamera( mouse, camera );
		return raycaster.intersectObjects(scene.children);
	}

	var mouseDown = function(event){
		
	};

	var mouseMove = function(event){

	};

	var mouseUp = function(event){

	};

	var parseCommand = function (event){
		if (event.which === 13){
			var command = $(this).val().split(',');
			if(command[0] === "path"){
				
			}
		}

	};

	return {
		init : function(threeView){
			rndr = threeView.rndr;
			ctrl = threeView.ctrl;
			scene = threeView.scene;
			camera = threeView.camera;
			canvasElement = threeView.canvasElement;

			canvasElement.addEventListener( 'mousedown', mouseDown, false );
			canvasElement.addEventListener( 'mousemove', mouseMove, false );
			canvasElement.addEventListener( 'mouseup', mouseUp, false );
			$('#command-line').on('keydown', parseCommand);
		}
	}
})();