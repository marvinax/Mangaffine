var THREE = require('three');
var EditablePath = require('./EditablePath.js');

EditableSketch = function(renderer, scene, camera, controls, commands){
	THREE.Object3D.call(this);

	this.plane = new THREE.Mesh(
					new THREE.PlaneBufferGeometry( 2000, 2000, 8, 8 ),
					new THREE.MeshBasicMaterial( { color: 0x000000, opacity: 0.25, transparent: true } )
				);
	this.plane.visible = false;
	scene.add( this.plane );

	this.raycaster = new THREE.Raycaster();
	this.container = renderer.domElement.parentNode;
	this.offset = new THREE.Vector3();

	this.editing = true;
	this.adding = false;

	this.mouse = new THREE.Vector3();

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

		if(this.adding){
		}

		if(this.editing){
			if ( this.SELECTED ) {
				// console.log(this.SELECTED.object.parent.path.points.map(function(e){return e.x+" "+e.y+" "+e.z}));
				var intersects = this.raycaster.intersectObject( this.plane );
				this.SELECTED.object.parent.setFromRaycaster(this.SELECTED, intersects[0].point, this.offset);
				return;
	
			}
	
			var intersects = this.raycaster.intersectObjects( this.children );
	
			if ( intersects.length > 0 ) {
				if ( (this.INTERSECTED == null) ){
					this.INTERSECTED = intersects[ 0 ];
					// console.log(this.INTERSECTED.object.parent.points[this.INTERSECTED.index]);
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

		if (this.editing) {	
			var intersects = raycaster.intersectObjects( this.children );

			if ( intersects.length > 0 ) {
				// console.log(intersects.map(function(e){return e.index}));
				controls.enabled = false;

				if(intersects.length ==2 && intersects[0].index == 0) {
					this.SELECTED = intersects[ 1 ];
				} else if (intersects.length == 3){
					// for non-end point over the path.
					this.SELECTED = intersects[2];
				} else {
					this.SELECTED = intersects[0];
				}

				// NOTE that the intersects has been changed to the intersection between the ray 
				// of the mouse and the invisible plane, since the former intersect between mouse
				// ray and point cloud has been retained to this.SELECTED.
				var intersects = raycaster.intersectObject( this.plane );
				this.offset.copy( intersects[0].point ).sub( this.plane.position );

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
			var finish = raycaster.intersectObject( this.NEWPATH );
			if (finish[0]){
				controls.enabled = true;
				this.adding = false;
				this.editing = true;
				this.NEWPATH = null;
			}
		}


		if (this.adding) {
			var p = raycaster.intersectObject( this.plane )[0].point;

			if (!this.NEWPATH){

				controls.enabled = false;
				
				// handles the first point of the path is created, while the first curve
				// is not created yet.
				
				if(!this.START){
					this.START = p;
					this.STARTPOINT.geometry.vertices = [p];
					this.STARTPOINT.geometry.verticesNeedUpdate = true;
					this.STARTPOINT.visible = true;

				} else {

					this.NEWPATH = new EditablePath([this.START, this.START, p.clone(), p.clone()]);
					this.add(this.NEWPATH);
					this.START = null;
					this.STARTPOINT.visible = false;
				}
			} else {

				this.NEWPATH.addFromRaycaster(p);

				// For showing the 3D point coordinates
				// console.log(this.NEWPATH.path.points.map(function(e){return e.x+" "+e.y+" "+e.z}));
				// console.log(this.NEWPATH.path.children.map(function(e){return e.points.map(function(e){return e.x+" "+e.y+" "+e.z})}));

			}
		}


		if(this.editing){
	
			controls.enabled = true;

			if ( this.INTERSECTED ) {

				this.plane.position.copy( this.INTERSECTED.object.parent.points[this.INTERSECTED.index] );

				this.SELECTED = null;

			}

			this.container.style.cursor = 'auto';		
		}

	}.bind(this);

	renderer.domElement.addEventListener( 'mouseup', onSketchMouseUp, false );
}



EditableSketch.prototype = Object.create(THREE.Object3D.prototype);
EditableSketch.prototype.constructor = EditableSketch;

module.exports = EditableSketch;