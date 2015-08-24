var THREE = require('three');
var Trackball = require('three.trackball');

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
						console.log(editing);
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

		initEditingPlane : function(){
			editingPlane = new THREE.Mesh(
				new THREE.PlaneBufferGeometry( 100, 100),
				new THREE.MeshBasicMaterial({
					color : 0xDDDDDD,
					transparent : true,
					opacity : 0.2,
					visible : false
				})
			);
		},

		initRaycaster : function(){
			raycaster = new THREE.Raycaster();
			mouse = new THREE.Vector2(0, 0);

			window.addEventListener("mousemove", function(e){
				mouse.x = ( event.clientX / rndr.domElement.width ) * 4 - 1;
				mouse.y = - ( event.clientY / rndr.domElement.height ) * 4 + 1;
			}, false);
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
			camera.position.set(0, 0, 300);

			var ambient = new THREE.AmbientLight(0x202020);

			var light = new THREE.DirectionalLight( 0xe0e0e0, 1 );
				light.position = camera.position;
			
			camera.add( light );

			scene = new THREE.Scene();
			scene.fog = new THREE.FogExp2( 0xFFFFFF, 0.003 );

			sketch = new THREE.Object3D();
			sketch.up = camera.up;
			sketch.lookAt(camera.position);

			scene.add(camera);
			scene.add(ambient);
			scene.add(sketch);
		},

		render : function(){
			raycaster.setFromCamera(mouse, camera);

			if(editing){
				intersects = raycaster.intersectObject( sketch, true );
				if(intersects.length > 0 ){
					intersects.forEach(function(e){
						if (e.object.type === "PointCloud") {

						}
					});
				}
			}
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


			window.addEventListener('mousedown', function(e){
				mouseDown = true;
			}, false);

			this.initScene(width, height);
			this.initRenderer(canvasElement, width, height);
			this.initControl(canvasElement);
			this.initRaycaster();
			this.initEditingPlane();
			this.initCommand();

			this.rndr = rndr;
			this.camera = camera;
			this.scene = scene;
			this.ctrl = ctrl;
			this.canvasElement = canvasElement;
			this.raycaster = raycaster;
			this.sketch = sketch;

			this.render();
			this.animate();
		}
	}
})();