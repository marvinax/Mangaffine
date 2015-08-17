var THREE = require('three');

var pointMaterial = new THREE.PointCloudMaterial({
	transparent : true,
	opacity : 0.5,
	color : 0xE11C51,
	size : 3
});

module.exports = function(){

	var points = [];
	for (var i = 0; i < 4; i++){
		points.push(new THREE.Vector3());
	}

	var handles = new THREE.PointCloud(new THREE.Geometry(), pointMaterial);
		handles.geometry.vertices = points;
		handles.geometry.verticesNeedUpdate = true;

	var resolution = 15,
		vertices = [];
	for (var i = 0; i < resolution; i++){
		vertices.push(new THREE.Vector3());
	}

	var curveBody = new THREE.Line(new THREE.Geometry());
		curveBody.geometry.vertices = vertices;
		curveBody.geometry.verticesNeedUpdate = true;

	var controlLine1 = new THREE.Line(new THREE.Geometry());
		controlLine1.geometry.verticesNeedUpdate = true;

	var controlLine2 = new THREE.Line(new THREE.Geometry());
		controlLine2.geometry.verticesNeedUpdate = true;

	var curve = new THREE.Object3D();
		curve.add(handles, curveBody, controlLine1, controlLine2);

	var setPoints = function(p){
		controlLine1.geometry.vertices.push(points[1], points[0]);
		controlLine2.geometry.vertices.push(points[2], points[3]);
	}

	var setVertices = function(p, v){
		for (var i = resolution - 1; i >= 0; i--) {
			var t = i / (resolution - 1);
			var tsq = t*t,
				tcb = tsq*t,
				t_sq = (1-t)*(1-t),
				t_cb = t_sq*(1-t);

			vertices[i].set(
				p[0].x * tcb + 3*p[1].x * tsq * (1-t) + 3*p[2].x * t_sq* t + p[3].x * t_cb,
				p[0].y * tcb + 3*p[1].y * tsq * (1-t) + 3*p[2].y * t_sq* t + p[3].y * t_cb,
				p[0].z * tcb + 3*p[1].z * tsq * (1-t) + 3*p[2].z * t_sq* t + p[3].z * t_cb
			);
		};

		curveBody.geometry.verticesNeedUpdate = true;
	}

	return {
		init : function(v0, c0, c1, v1){
			points[0] = v0;
			points[1] = c0;
			points[2] = c1;
			points[3] = v1;
			
			setPoints(points);

			resolution = Math.floor(v0.distanceTo(c0) + c0.distanceTo(c1) + c1.distanceTo(v1));

			for (var i = 0 ; i < resolution; i++) {
				vertices[i] = new THREE.Vector3();
			};

			setVertices(points, vertices);
			this.points = points;
			this.handles = handles;
			this.curve = curve;
		},
	}
}