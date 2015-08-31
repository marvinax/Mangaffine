var THREE = require('three');
var Trackball = require('three.trackball');
var EditableSketch = require('./EditableSketch.js');

module.exports = (function(){
	$('#viewport').height(window.innerHeight).width(window.innerWidth);
	$('#command-line').focus();

	// Fundamental objects of a three.js view
	var ctrl, rndr, camera, scene, sketch;

	// editingPlane is a plane mesh with fixed width and height,
	// it will change it's origin to the control point of the path
	// currently being edited. When mouse drags the control point
	// to a new place, the new control point in 3D world would be 
	// the intersection between the plane and the ray from camera
	// through mouse.
	var mouse, raycaster, intersects, editingPlane;

	var editing = false;

	var mouseOnHover = false;
		mouseDown = false;
		mouseDrag = false;

	var editingPoint = new THREE.Vector3( );

	var toggleEditing = function(){
		editing = !editing;
		ctrl.noRotate = !ctrl.noRotate;
	};


	return {

		add : function(graphic, name){
			graphic.name = name;
			sketch.add(graphic)
		},

		remove : function(graphic){
			sketch.remove(graphic)
		},

		initCommand : function(){
			$('#command-line').on("keydown", function(e){
				if (e.which === 13) {
					var command = $(this).val().split(" ")
					if (command[0] === "edit"){
						toggleEditing();
					}
					$(this).val('');
				}
			})
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
			rndr.sortObjects = false;
		},

		initControl : function(canvasElement){
			ctrl = new Trackball(camera, canvasElement);
			ctrl.rotateSpeed = 1.;
			ctrl.zoomSpeed = 1;
			ctrl.panSpeed = 0.8;
			ctrl.noZoom = false;
			ctrl.noPan = false;
			ctrl.dynamicDampingFactor = 0.5;
		},

		initScene : function(width, height){
			camera = new THREE.PerspectiveCamera( 20, width / height, 10, 1000 );
			camera.position.set(0, 0, 200);

			var ambient = new THREE.AmbientLight(0x202020);

			var light = new THREE.DirectionalLight( 0xe0e0e0, 1 );
				light.position = camera.position;
			
			camera.add( light );

			scene = new THREE.Scene();
			scene.fog = new THREE.FogExp2( 0xFFFFFF, 0.003 );

			scene.add(camera);
			scene.add(ambient);
		},

		initSketch : function(rndr, scene, camera, ctrl){
			sketch = new EditableSketch(rndr, scene, camera, ctrl);
			scene.add(sketch);
		},

		render : function(timestamp){
			rndr.render(scene, camera);
		},

		animate : function(){
			var that = this;
			requestAnimationFrame(function(time){
				that.animate();
				ctrl.update();
				that.render(time);
			});
		},

		init : function(canvasElement){
			var width = parseInt(canvasElement.style.width, 10),
				height = parseInt(canvasElement.style.height, 10);


			this.initScene(width, height);
			this.initRenderer(canvasElement, width, height);
			this.initControl(canvasElement);
			this.initSketch(rndr, scene, camera, ctrl);
			this.initCommand();

			this.rndr = rndr;
			this.camera = camera;
			this.scene = scene;
			this.ctrl = ctrl;
			this.canvasElement = canvasElement;
			this.sketch = sketch;

			this.render();
			this.animate();
		}
	}
})();