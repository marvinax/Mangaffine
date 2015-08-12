ThreeViewport = function(demoName){
	this.materials;
	this.ctrl;
	this.rndr;
	this.scene;
	this.camera;

	this.init(demoName);
	$(window).resize(function(){
		var width = $('#'+demoName).width(),
			height = $('#'+demoName).height();
		this.rndr.setSize(width, height);
		this.camera.aspect = width/height;
		this.camera.updateProjectionMatrix();
	}.bind(this));
}

ThreeViewport.prototype.constructor = ThreeViewport;

ThreeViewport.prototype.initControl = function(demoName){
	this.ctrl = new THREE.TrackballControls(this.camera, $("#"+demoName).get(0));
	this.ctrl.rotateSpeed = 1.0;
	this.ctrl.zoomSpeed = 1.2;
	this.ctrl.panSpeed = 0.8;
	this.ctrl.noZoom = false;
	this.ctrl.noPan = false;
	this.ctrl.staticMoving = false;
	this.ctrl.isChanging = false;

	this.ctrl.dynamicDampingFactor = 0.3;

	this.ctrl.addEventListener('start', function(e){
		console.log('start')
		this.ctrl.isChanging = true;
		this.animate();
	}.bind(this));

	this.ctrl.addEventListener('change', function(e){
		console.log('change');
		this.ctrl.isChanging = true;
	}.bind(this));
};

ThreeViewport.prototype.initRenderer = function(demoName, width, height){
	this.rndr = new THREE.WebGLRenderer({
		alpha:true,
		antialias: true
	});
	$("#"+demoName).get(0).appendChild( this.rndr.domElement );

	this.rndr.setPixelRatio(window.devicePixelRatio);
	this.rndr.setSize( width, height);
	this.rndr.setClearColor( 0xfafafa, 1);
}

ThreeViewport.prototype.initScene = function(width, height){
	this.camera = new THREE.PerspectiveCamera( 20, width / height, 10, 1000 );
	this.camera.position.set(0, 0, 200);

	var ambient = new THREE.AmbientLight(0x202020);

	var light = new THREE.DirectionalLight( 0xe0e0e0, 1 );
    	light.position = this.camera.position;
    
    this.camera.add( light );

	this.scene = new THREE.Scene();
	this.scene.add(this.camera);
	this.scene.add(ambient);

	this.scene.add(new THREE.Mesh(new THREE.BoxGeometry(5, 5, 5), new THREE.MeshLambertMaterial()));
}

ThreeViewport.prototype.render = function(){
	this.rndr.render(this.scene, this.camera);
}

ThreeViewport.prototype.animate = function(){
	var that = this;
	if(that.ctrl.isChanging)
		requestAnimationFrame(function(){
			that.ctrl.update();
			that.animate();
			that.render();
	    });
}

ThreeViewport.prototype.init = function(demoName) {
	var width = $('#'+demoName).width(),
		height = $('#'+demoName).height();
	this.initScene(width, height);
	this.initRenderer(demoName, width, height);
	this.initControl(demoName, width, height);
	
	this.render();
	this.animate();
}

ThreeViewport.prototype.resize = function(demoName){
	var width = $('#'+demoName).width(),
		height = $('#'+demoName).height();
	this.rndr.setSize(width, height);
}
