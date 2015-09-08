var THREE = require('three');
var Path = require('./Path.js');
var LabelCloud = require('./TextLabelCloud.js');

EditablePath = function(points, name){
	THREE.Object3D.call(this);
	
	this.points = points;

	this.directionLocked = true;
	this.ratioLocked = false;

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

	this.nameLabel = new LabelCloud([points[0]], [name]);

	this.add(this.path, this.handlePoints, this.handleLines, this.labels, this.nameLabel);
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
	this.path.addPoint(point);
	this.addColor();
	this.labels.addIndexLabel(point);

}

EditablePath.prototype.addFromRaycaster = function(point){

	this.path.addPoint(point);
	this.addColor();
	this.labels.addIndexLabel(point);
	this.handlePoints.geometry.dispose();
}

EditablePath.prototype.removePointAt = function(index){
	this.path.removePointAt(index);
	this.labels.removeLabelAt(index);
	this.removeColor();
}

EditablePath.prototype.setEndPointAt = function(point, index){
	this.path.setEndPointAt(point, index);
	this.labels.setLabelPositionAt(point, index);

	if(index == 0){
		var p1 = (new THREE.Vector3()).copy(point);
		p1.setX(p1.x + 1);
		this.nameLabel.setLabelPositionAt(p1, index);
	}
}

EditablePath.prototype.setControlPointAt = function(point, index, which, directionLocked, ratioLocked){
	this.path.setControlPointAt(point, index, which, directionLocked, ratioLocked);
}

EditablePath.prototype.setFromRaycaster = function(selected, planeIntersect, offset){
	
	var pointIndex = Math.round(selected.index / 3),
		controlIndex = selected.index - pointIndex * 3;
	var newPoint = new THREE.Vector3();
		newPoint.subVectors(planeIntersect, offset);

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

EditablePath.prototype.dispose = function(){
	this.remove(this.handlePoints)
	this.handlePoints.geometry.dispose();
	this.handlePoints.material.dispose();

	this.remove(this.handleLines);
	this.handleLines.geometry.dispose();
	this.handleLines.material.dispose();
}

module.exports = EditablePath;