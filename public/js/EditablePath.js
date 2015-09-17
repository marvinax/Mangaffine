var THREE = require('three');
var Path = require('./Path.js');
var LabelCloud = require('./TextLabelCloud.js');

EditablePath = function(points, name){
	THREE.Object3D.call(this);

	this.CLOSED = false;
	this.FACING_CAMERA = false;

	this.points = points;

	this.plane = new THREE.Mesh(
					new THREE.PlaneBufferGeometry( 4000, 4000, 8, 8 ),
					new THREE.MeshBasicMaterial( { color: 0x000000, opacity: 0.25, transparent: true } )
				);
	this.plane.visible = false;

	this.handlePoints = new THREE.PointCloud(new THREE.Geometry(), new THREE.PointCloudMaterial());
	this.handlePoints.geometry.vertices = this.points;
	this.handlePoints.geometry.verticesNeedUpdate = true;
	this.handlePoints.geometry.colors = [];

	this.points.forEach(function(){
		this.handlePoints.geometry.colors.push(new THREE.Color(0x997584));
	}.bind(this));

	this.handlePoints.material.vertexColors = THREE.VertexColors;
	this.handlePoints.material.transparent = true;
	this.handlePoints.material.opacity = 0.9;
	this.handlePoints.material.size = 20;
	this.handlePoints.material.sizeAttenuation = false;

	this.handleLines = new THREE.Line(new THREE.Geometry(), new THREE.LineBasicMaterial());
	this.handleLines.geometry.vertices = this.points;
	this.handleLines.geometry.verticesNeedUpdate = true;

	this.handleLines.material.color = new THREE.Color(0x7F7F7F);
	this.handleLines.material.transparent = true;
	this.handleLines.material.opacity = 0.9;

	this.path = new Path(points);

	this.labels = new LabelCloud(points);

	this.name = name;

	this.nameLabel = new LabelCloud([this.points[0]], [name]);
	console.log(this.name);
	this.add(this.path, this.handlePoints, this.handleLines, this.labels, this.nameLabel, this.plane);
}

EditablePath.prototype = Object.create(THREE.Object3D.prototype);
EditablePath.prototype.constructor = EditablePath;

EditablePath.prototype.addColor = function(){
	this.handlePoints.geometry.colors.push(new THREE.Color(0x997584), new THREE.Color(0x997584), new THREE.Color(0x997584));
}

EditablePath.prototype.removeColor = function(){
	this.handlePoints.geometry.colors.pop();
}

EditablePath.prototype.addPoint = function(point){
	this.points.push(point.clone(), point.clone(), point.clone());

	this.path.addPoint(point);
	this.addColor();
	this.labels.add3Labels(point);

	this.update();
}

EditablePath.prototype.update =function(index){
	this.path.update(this.points, index);
	this.labels.update(this.points, index);
	this.handlePoints.geometry.dispose();
	this.handleLines.geometry.dispose();
}


EditablePath.prototype.removePointAt = function(index){

	if (index == 0){
		this.points.splice(0, 3);
	} else if (index == this.points.length){
		this.points.splice(this.points.length - 3, 3);
	} else {
		this.points.splice(index - 1, 3);
	}

	this.labels.removeLabel();
	this.labels.removeLabel();
	this.labels.removeLabel();
	this.path.removePoint();
	this.removeColor();

	this.path.update(this.points);
	this.labels.update(this.points);
}

EditablePath.prototype.setPointAt = function(point, index){

	this.points[index].copy(point);
	if (index == 0){

		if(this.CLOSED){
			this.points[this.points.length - 1].copy(point);
		}

		var labelPoint = new THREE.Vector3();
		labelPoint.addVectors(point, new THREE.Vector3(2, 0, 0));
		this.nameLabel.setLabelPositionAt(labelPoint, 0);
	}

	if (this.CLOSED && index == this.points.length - 1){
		this.points[0].copy(point);
	}

	this.update(index);
}

EditablePath.prototype.setProject = function(camera){
	
	this.points.forEach(function(e){
		e = e.project(camera);

		e.x *= 35 * camera.aspect;
		e.y *= 35;
		e.z = 0;

	})
	this.update();
	this.FACING_CAMERA = true;
}

EditablePath.prototype.setDualOf = function(index, ratio){

	var thisIndex = index % 3;

	if(thisIndex == 0){
		return;
	}

	var pointIndex = (thisIndex - 1) * 3 + ( index - thisIndex );
	var whichNeighbor = (thisIndex * 2 - 3);
	var dualIndex = pointIndex + whichNeighbor;

	var difference = new THREE.Vector3();
		difference.subVectors(this.points[pointIndex], this.points[thisIndex]);
		difference.multiplyScalar(ratio);
	
	this.points[dualIndex].addVectors(this.points[pointIndex], difference);

	this.path.update(this.points);
	this.labels.update(this.points);
}

EditablePath.prototype.trans = function(vec, mag, indices){
	console.log(indices);

	var finalVec = vec.clone();
		finalVec.normalize();
		finalVec.multiplyScalar(mag);

	indices.forEach(function(i){
		this.points[i].add(finalVec);
	}.bind(this));

	this.update()
}

EditablePath.prototype.rotate = function(vec, angle, indices) {
	indices.forEach(function(i){
		this.points[i].applyAxisAngle(vec, angle);
	})

	this.update();
};

EditablePath.prototype.raycast = function(raycaster, intersects){
	this.handlePoints.raycast(raycaster, intersects);
}

EditablePath.prototype.dispose = function(){
	this.remove(this.handlePoints)
	this.handlePoints.geometry.dispose();
	this.handlePoints.material.dispose();

	this.remove(this.handleLines);
	this.handleLines.geometry.dispose();
	this.handleLines.material.dispose();
}

module.exports = EditablePath;