var THREE = require('three');
var Trackball = require('three.trackball');


module.exports = (function(){

	// Fundamental objects of a three.js view
	var materials, ctrl, rndr, scene, camera;

	return {
		initRenderer : function(canvasID, width, height){
			rndr = new THREE.WebGLRenderer({
				alpha:true,
				antialias: true
			});

			$("#"+canvasID).get(0).appendChild( rndr.domElement );

			rndr.setPixelRatio(window.devicePixelRatio);
			rndr.setSize(width, height);
			rndr.setClearColor( 0xfafafa, 1);
		},

		initControl : function(canvasID){
			ctrl = new Trackball(camera, $("#"+canvasID).get(0));
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
			camera.position.set(0, 0, 200);

			var ambient = new THREE.AmbientLight(0x202020);

			var light = new THREE.DirectionalLight( 0xe0e0e0, 1 );
				light.position = camera.position;
			
			camera.add( light );

			scene = new THREE.Scene();
			scene.add(camera);
			scene.add(ambient);

			scene.add(new THREE.Mesh(new THREE.BoxGeometry(5, 5, 5), new THREE.MeshLambertMaterial()));
		},

		render : function(){
			rndr.render(scene, camera);
		},

		animate : function(){
			var that = this;
			requestAnimationFrame(function(){
				ctrl.update();
				that.animate();
				that.render();
			});
		},

		resize : function(canvasID){
			var width = $('#'+canvasID).width(),
				height = $('#'+canvasID).height();
			rndr.setSize(width, height);
		},

		init : function(canvasID){
			var width = $('#'+canvasID).width(),
				height = $('#'+canvasID).height();
			this.initScene(width, height);
			this.initRenderer(canvasID, width, height);
			this.initControl(canvasID, width, height);

			$(window).resize(function(){
				var width = $('#'+canvasID).width(),
					height = $('#'+canvasID).height();
				this.rndr.setSize(width, height);
				this.camera.aspect = width/height;
				this.camera.updateProjectionMatrix();
			}.bind(this));
			
			this.render();
			this.animate();
		}
	}
})();