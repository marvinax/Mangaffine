var THREE = require('three');
var EditablePath = require('./EditablePath.js');

EditableSketch = function(renderer, scene, camera, controls){
	THREE.Object3D.call(this);

	this.rndr = renderer;
	this.scene = scene;
	this.camera = camera;
	this.ctrl = controls;

	this.plane = new THREE.Mesh(
					new THREE.PlaneBufferGeometry( 2000, 2000, 8, 8 ),
					new THREE.MeshBasicMaterial( { color: 0x000000, opacity: 0.25, transparent: true } )
				);
	this.plane.visible = false;
	scene.add( this.plane );

	this.raycaster = new THREE.Raycaster();
	this.container = renderer.domElement.parentNode;

	this.EDITING = true;
	this.ADDING = false;

	this.mouse = new THREE.Vector3();

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
				var intersects = this.raycaster.intersectObject( this.plane );
				// this.MOUSE_SELECTED.object.parent.setFromRaycaster(this.MOUSE_SELECTED, intersects[0].point);
				this.MOUSE_SELECTED.object.parent.setPointAt(intersects[0].point, this.MOUSE_SELECTED.index);
				return;
	
			}
	
			var intersects = this.raycaster.intersectObjects( this.children );
	
			if ( intersects.length > 0 ) {
				if ( (this.INTERSECTED == null) ){
					this.INTERSECTED = intersects[ 0 ];
					this.plane.position.copy( this.INTERSECTED.object.parent.points[this.INTERSECTED.index] );
					this.plane.lookAt( camera.position );
				}
	
				this.container.style.cursor = 'pointer';
	
			} else {
	
				this.INTERSECTED = null;
	
				this.container.style.cursor = 'auto';
	
			}
		}
	}.bind(this);

	renderer.domElement.addEventListener( 'mousemove', onSketchMouseMove, false );


	var onSketchMouseDown = function ( event ) {
		event.preventDefault();

		var raycaster = new THREE.Raycaster();
			raycaster.setFromCamera(this.mouse, camera);

		if (this.EDITING) {	
			var intersects = raycaster.intersectObjects( this.children );

			if ( intersects.length > 0 ) {
				// console.log(intersects.map(function(e){return e.index}));
				controls.enabled = false;

				if(intersects.length ==2 && intersects[0].index == 0) {
					this.MOUSE_SELECTED = intersects[ 1 ];
				} else if (intersects.length == 3){
					// for non-end point over the path.
					this.MOUSE_SELECTED = intersects[2];
				} else {
					this.MOUSE_SELECTED = intersects[0];
				}

				// NOTE that the intersects has been changed to the intersection between the ray 
				// of the mouse and the invisible plane, since the former intersect between mouse
				// ray and point cloud has been retained to this.MOUSE_SELECTED.
				var intersects = raycaster.intersectObject( this.plane );
				this.container.style.cursor = 'move';

			}
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
					var p = raycaster.intersectObject( this.plane )[0].point;
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
			var p = raycaster.intersectObject( this.plane )[0].point;

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

					this.NEWPATH = new EditablePath([this.START, this.START, p.clone(), p.clone()], this.NEWPATHNAME);
					this.add(this.NEWPATH);
					this.NEWPATH.name = this.NEWPATHNAME;
					this.START = null;
					this.STARTPOINT.visible = false;
				}
			} else {

				this.NEWPATH.addPoint(p);

				// For showing the 3D point coordinates
				// console.log(this.NEWPATH.path.points.map(function(e){return e.x+" "+e.y+" "+e.z}));
				// console.log(this.NEWPATH.path.children.map(function(e){return e.points.map(function(e){return e.x+" "+e.y+" "+e.z})}));

			}
		}


		if(this.EDITING){
	
			controls.enabled = true;

			if ( this.INTERSECTED ) {

				this.plane.position.copy( this.INTERSECTED.object.parent.points[this.INTERSECTED.index] );

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
	this.traverse(function(path){
		if(path.FACING_CAMERA){
			path.up = new THREE.Vector3(0, 1, 0);
			path.lookAt(this.camera.position);
		}
	}.bind(this))
}

module.exports = EditableSketch;