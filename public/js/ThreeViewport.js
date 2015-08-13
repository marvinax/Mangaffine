var THREE = require('three');
var Trackball = require('three.trackball');

module.exports = (function(){

	// Fundamental objects of a three.js view
	var ctrl, rndr, scene, camera;

	// For capturing the mouse coord over the screen
	// and unproject to 3D model.
	var raycaster, mouse;

	// mouseHandler should provide the method that handle
	// mouseDown and mouseMove events. ThreeViewports
	// passes the result of raycasting into those methods,
	// for further processing.
	var raycastHandler;

	// Moving canvas (a plane always facing to camera)
	var canvasPlane = new THREE.Mesh(
		new THREE.PlaneBufferGeometry(180, 90),
		new THREE.MeshBasicMaterial(
			{
				color : 0x7F7F7F,
				transparent : true,
				opacity : 0.2
			}
		));
		canvasPlane.name = "canvas-plane";

	var getIntersections = function(){
		mouse.x = ( 2*event.clientX / rndr.domElement.width ) * 2 - 1;
		mouse.y = - ( 2*event.clientY / rndr.domElement.height ) * 2 + 1;
		raycaster.setFromCamera( mouse, camera );
		return raycaster.intersectObjects(scene.children);
	}

	var onMouseMove = function( event ) {
		event.preventDefault();
		raycastHandler.move(event, ctrl, getIntersections());
	};

	var onMouseDown = function( event ) {
		event.preventDefault();
		raycastHandler.down(event, ctrl, getIntersections());
	};

	var onMouseUp = function(event){
		event.preventDefault();
		raycastHandler.up(event, ctrl, getIntersections());
	}

	return {

		add : function(graphic){
			scene.add(graphic)
		},

		remove : function(graphic){
			scene.remove(graphic)
		},

		getCtrl : function(){
			return ctrl;
		},

		initRaycaster : function(){
			raycaster = new THREE.Raycaster();
			mouse = new THREE.Vector2();
		},

		initRenderer : function(canvasElement, width, height){
			rndr = new THREE.WebGLRenderer({
				alpha:true,
				antialias: true
			});

			canvasElement.appendChild( rndr.domElement );

			rndr.setPixelRatio(window.devicePixelRatio);
			rndr.setSize(width, height);
			rndr.setClearColor( 0xfafafa, 1);
		},

		initControl : function(canvasElement){
			ctrl = new Trackball(camera, canvasElement);
			ctrl.rotateSpeed = 1.0;
			ctrl.zoomSpeed = 1.2;
			ctrl.panSpeed = 0.8;
			ctrl.noZoom = false;
			ctrl.noPan = false;
			ctrl.staticMoving = false;
			ctrl.dynamicDampingFactor = 0.3;
		},

		initScene : function(width, height){
			camera = new THREE.PerspectiveCamera( 20, width / height, 10, 1000 );
			camera.position.set(0, 0, 300);

			var ambient = new THREE.AmbientLight(0x202020);

			var light = new THREE.DirectionalLight( 0xe0e0e0, 1 );
				light.position = camera.position;
			
			camera.add( light );

			canvasPlane.up = camera.up;

			scene = new THREE.Scene();
			scene.add(camera);
			scene.add(ambient);
			scene.add(canvasPlane);
		},

		render : function(){
			canvasPlane.lookAt(camera.position);
			rndr.render(scene, camera);
		},

		animate : function(){
			var that = this;
			requestAnimationFrame(function(){
				that.animate();
				ctrl.update();
				that.render();
			});
		},

		init : function(canvasElement, raycast){
			var width = parseInt(canvasElement.style.width, 10),
				height = parseInt(canvasElement.style.height, 10);

			raycastHandler = raycast;

			this.initScene(width, height);
			this.initRenderer(canvasElement, width, height);
			this.initControl(canvasElement);
			this.initRaycaster();

			canvasElement.addEventListener( 'mousedown', onMouseDown, false );
			canvasElement.addEventListener( 'mousemove', onMouseMove, false );
			canvasElement.addEventListener( 'mouseup', onMouseUp, false );

			this.render();
			this.animate();
		}
	}
})();