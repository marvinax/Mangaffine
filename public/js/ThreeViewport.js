var THREE = require('three');
var Trackball = require('three.trackball');


module.exports = (function(){

	// Fundamental objects of a three.js view
	var ctrl, rndr, scene, camera;

	return {

		add : function(graphic){
			scene.add(graphic)
		},

		getCtrl : function(){
			return ctrl;
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

		init : function(canvasElement){
			var width = parseInt(canvasElement.style.width, 10),
				height = parseInt(canvasElement.style.height, 10);
			console.log(width);
			this.initScene(width, height);
			this.initRenderer(canvasElement, width, height);
			this.initControl(canvasElement);
			
			this.render();
			this.animate();
		}
	}
})();