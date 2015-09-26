var THREE = require('three');
var EditablePath = require('./EditablePath.js');

EditableSketch = function(renderer, scene, camera, controls){
	THREE.Object3D.call(this);

	this.rndr = renderer;
	this.scene = scene;
	this.camera = camera;
	this.ctrl = controls;

	this.projectionMatrix = new THREE.Vector3();

	this.plane = new THREE.Mesh(
					new THREE.PlaneBufferGeometry( 40, 40, 8, 8 ),
					new THREE.MeshBasicMaterial( { color: 0x000000, opacity: 0.15, side: THREE.DoubleSide, transparent: true } )
				);
	this.plane.visible = false;
	scene.add( this.plane );

	this.raycaster = new THREE.Raycaster();
	this.container = renderer.domElement.parentNode;

	this.EDITING = true;
	this.ADDING = false;

	this.mouse = new THREE.Vector3();
	this.offset = new THREE.Vector3();

	this.COMMAND_SELECTED = [];

	this.STARTPOINT = new THREE.PointCloud(new THREE.Geometry(), new THREE.PointCloudMaterial({color : 0x000000}));
	this.STARTPOINT.material.transparent = true;
	this.STARTPOINT.material.opacity = 0.9;
	this.STARTPOINT.material.size = 20;
	this.STARTPOINT.material.sizeAttenuation = false;

	this.STARTPOINT.geometry.vertices = [new THREE.Vector3()];
	this.STARTPOINT.geometry.verticesNeedUpdate = true;
	this.STARTPOINT.visible = false;
	scene.add(this.STARTPOINT);

	var onSketchMouseMove = function( event ) {

		event.preventDefault();


		this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

		this.raycaster.setFromCamera( this.mouse, camera );

		if(this.ADDING){

			controls.enabled = false;
		}

		if(this.EDITING){
			if ( this.MOUSE_SELECTED ) {
				this.movePathPoint();
			} else {
				this.detectPathPoint();
			}

		}
	}.bind(this);

	renderer.domElement.addEventListener( 'mousemove', onSketchMouseMove, false );


	var onSketchMouseDown = function ( event ) {
		event.preventDefault();

		if (this.EDITING) {	
			this.selectPathPoint();
		}
	}.bind(this);

	renderer.domElement.addEventListener( 'mousedown', onSketchMouseDown, false );

	var onSketchMouseUp = function( event ) {

		event.preventDefault();

		var raycaster = new THREE.Raycaster();
			raycaster.setFromCamera(this.mouse, camera);

		if(this.NEWPATH){
			var lastSelected = raycaster.intersectObject( this.NEWPATH );

			var finish, closed;
			lastSelected.forEach(function(e){
				finish = finish || ((e.index == this.NEWPATH.points.length - 1) || (e.index == 0));
				closed = closed || (e.index == 0);
			}.bind(this));

			if (finish){

				if(closed){
					var p = this.getPointAtZeroPlane(this.mouse, this.camera);
					this.NEWPATH.addPoint(p);
					this.NEWPATH.CLOSED = true;
				}

				controls.enabled = true;
				this.ADDING = false;
				this.EDITING = true;
				this.NEWPATH = null;
				this.NEWPATHNAME = null;
			}
		}


		if (this.ADDING) {
			var p = this.getPointAtZeroPlane(this.mouse, this.camera);
			controls.enabled = false;

			if (!this.NEWPATH){
				
				// handles the first point of the path is created, while the first curve
				// is not created yet.
				
				if(!this.START){
					this.START = p;
					this.STARTPOINT.geometry.vertices = [p];
					this.STARTPOINT.geometry.verticesNeedUpdate = true;
					this.STARTPOINT.visible = true;

				} else {

					this.NEWPATH = new EditablePath([this.START.clone(), this.START.clone(), p.clone(), p.clone()], this.NEWPATHNAME);
					this.add(this.NEWPATH);
					this.NEWPATH.name = this.NEWPATHNAME;
					this.START = null;
					this.STARTPOINT.visible = false;
				}
			} else {

				this.NEWPATH.addPoint(p);

			}
		}


		if(this.EDITING){
	
			controls.enabled = true;

			if ( this.INTERSECTED ) {

				this.MOUSE_SELECTED = null;

			}

			this.container.style.cursor = 'auto';		
		}

	}.bind(this);

	renderer.domElement.addEventListener( 'mouseup', onSketchMouseUp, false );
}



EditableSketch.prototype = Object.create(THREE.Object3D.prototype);
EditableSketch.prototype.constructor = EditableSketch;

EditableSketch.prototype.updateFacingCamera = function(){
	this.children.forEach(function(path){
		if(path.FLATTENED){
			path.up = this.camera.up;
			path.lookAt(this.camera.position);
			path.updateMatrixWorld();
		}
	}.bind(this))
}

EditableSketch.prototype.detectPathPoint = function(){

	// 0. WHEN NO POINT IS SELECTED
	// ============================
	// This part of code is continuously executed, in order to check whether the mouse cursor
	// is hovering on any points. If a point is detected, the plane for calculating subsequent
	// moving offset will be moved to that point, and THEN adjust its orientation. The reason
	// of changing the position before making it look at the camera is, if re-locating happens
	// before re-orienting, then the plane will be always facing same direction. That means all
	// points are moving on same 3D-plane. However, it will cause visual distortion due to
	// the perspective camera projection. Thus we'd prefer to make the points moving along a
	// spherical surface, which looks like moving on 2D plane surface with perspective camera.
	// 
	// Now you could set the position of plane as either the point, or the point applied all 3D
	// transform and right before rasterized. For 3D reference point, it's good to use the
	// original point on the path, while for 2D projected point, the raycasted 3D point will be
	// better, since it's already on the spherical surface, and even more precise than trans-
	// forming the model point with camera's inversed world matrix.

	var intersects = this.raycaster.intersectObjects( this.children );

	if ( intersects.length > 0 ) {
		if ( (this.INTERSECTED == null) ){
			this.INTERSECTED = intersects[ 0 ];

			var path = this.INTERSECTED.object.parent;

			this.plane.lookAt( this.camera.position );
			this.plane.up = this.camera.up;

			if(path.FLATTENED){
				var inversedPathMatrix = new THREE.Matrix4();
					inversedPathMatrix.getInverse(path.matrixWorld);

				this.plane.position.copy( this.INTERSECTED.point);
			} else {
				this.plane.position.copy( path.points[this.INTERSECTED.index] );
			}

		}

		this.container.style.cursor = 'pointer';

	} else {

		this.INTERSECTED = null;

		this.container.style.cursor = 'auto';

	}
}

EditableSketch.prototype.selectPathPoint = function(){

	// 1. SELECT POINT
	// ===============
	// No further calculation is made here. Just simply distinguish overlapping
	// control points. Both of the index of selected point, and the intersected
	// point (with camera plane) will be stored at this.MOUSE_SELECTED, and pass
	// to the next process.

	var raycaster = new THREE.Raycaster();
		raycaster.setFromCamera(this.mouse, this.camera);

	var intersects = raycaster.intersectObjects( this.children );

	if ( intersects.length > 0 ) {
		// console.log(intersects.map(function(e){return e.index}));
		this.ctrl.enabled = false;

		this.MOUSE_SELECTED = intersects[0];

		this.container.style.cursor = 'move';

	}

}

EditableSketch.prototype.movePathPoint = function(){

	// 2. MOVE CONTROL POINT OVER PATH
	// ===============================
	// As aforementioned, here we also need to deal with two types of moving control
	// points. For the first type of curve, which is not projected to the camera plane,
	// We first locate the point **OVER THE CURVE** with raycaster, and make it as the
	// center of the plane. Thus, when we drag the point, the point will be moving along
	// a plane which is parallel to the camera projection plane, which intersect with
	// the original coordinate of that point.
	// 
	// For the second type, it will be a little tricky. Since rotating the camera doesn't
	// modify the internal geometry, the point modification made over the screen needs to
	// be inversedly transformed and then applied to the geometry.

	var path = this.MOUSE_SELECTED.object.parent;

	this.plane.lookAt( this.camera.position );
	this.plane.up = this.camera.up;

	if(path.FLATTENED){
		this.plane.position.copy( this.MOUSE_SELECTED.point );
	} else {
		this.plane.position.copy( path.points[this.MOUSE_SELECTED.index] );
	}

	var intersects = this.raycaster.intersectObject( this.plane );

	if(path.FLATTENED){
		var inversedPathMatrix = new THREE.Matrix4();
			inversedPathMatrix.getInverse(path.matrixWorld);
		var point = intersects[0].point.clone();
			point.applyMatrix4(inversedPathMatrix);
		path.setPointAt(point, this.MOUSE_SELECTED.index);
	} else {
		path.setPointAt(intersects[0].point, this.MOUSE_SELECTED.index);
	}

	this.MOUSE_SELECTED.point = intersects[0].point;
}

EditableSketch.prototype.getPointAtZeroPlane = function(mouse, camera){

	var d = camera.projectionMatrix.elements[14],
		l = camera.position.length(),
		z = (l + 0.5 * d)/l;

	var p = new THREE.Vector3(mouse.x, mouse.y, z);
		p.unproject(camera);

	return p;

}

module.exports = EditableSketch;