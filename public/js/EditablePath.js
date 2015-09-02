var THREE = require('three');
var Path = require('./Path.js');
var LabelCloud = require('./TextLabelCloud.js');

EditablePath = function(points){
	THREE.Object3D.call(this);
	
	this.points = points;

	this.directionLocked = true;
	this.ratioLocked = false;

	this.handlePoints = new THREE.PointCloud(new THREE.Geometry(), new THREE.PointCloudMaterial());
	this.handlePoints.geometry.vertices = this.points;
	this.handlePoints.geometry.verticesNeedUpdate = true;

	this.handlePoints.material.color = new THREE.Color(0x7F7F7F);
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

	this.path = new Path(this.points);

	this.labels = new LabelCloud(this.points);

	this.add(this.path, this.handlePoints, this.handleLines);
}

EditablePath.prototype = Object.create(THREE.Object3D.prototype);
EditablePath.prototype.constructor = EditablePath;

EditablePath.prototype.addPoint = function(point){
	this.path.addPoint(point);
}

EditablePath.prototype.addFromRaycaster = function(point){
	
	// this.points.push(point);
	// this.labels.addTextLabel(this.points.length ? 0 : this.points.length-1, point);

	this.path.addPoint(point);
	this.handlePoints.geometry.dispose();
	this.handleLines.geometry.dispose();
}

EditablePath.prototype.removePointAt = function(index){
	this.path.removePointAt(index);
}

EditablePath.prototype.setEndPointAt = function(point, index){
	// this.points[index*3].copy(point);
	this.path.setEndPointAt(point, index);
}

EditablePath.prototype.setControlPointAt = function(point, index, which, directionLocked, ratioLocked){
	// this.points[index*3+which].copy(point);
	this.path.setControlPointAt(point, index, which, directionLocked, ratioLocked);
}

EditablePath.prototype.setFromRaycaster = function(selected, planeIntersect, offset){
	// console.log(selected);
	var pointIndex = Math.round(selected.index / 3),
		controlIndex = selected.index - pointIndex * 3;
	var newPoint = new THREE.Vector3();
		newPoint.subVectors(planeIntersect, offset);

	this.points[selected.index].copy(newPoint);

	if (controlIndex === 0){
		
		this.setEndPointAt(newPoint, pointIndex);
	
	} else {
		
		this.setControlPointAt(newPoint, pointIndex, controlIndex, this.directionLocked, this.ratioLocked);
	}

	this.handlePoints.geometry.vertices[selected.index] = newPoint;
	this.handleLines.geometry.vertices[selected.index] = newPoint;
	this.handlePoints.geometry.verticesNeedUpdate = true;
	this.handleLines.geometry.verticesNeedUpdate = true;
	this.points[selected.index] = newPoint;
}

EditablePath.prototype.raycast = function(raycaster, intersects){
	this.handlePoints.raycast(raycaster, intersects);
}

module.exports = EditablePath;