var THREE = require('three');

var pointMaterial = new THREE.PointCloudMaterial({
	transparent : true,
	opacity : 0.5,
	color : 0xE11C51,
	size : 3
});

module.exports = function(vec0, vec1, vec2, vec3){
	/**
	 * Points array is used to generate the Bezier curve. Make sure
	 * that only Vector3 reference is passed in.
	 * @type {Array}
	 */
	this.points = [];
	this.points.push(vec0, vec1, vec2, vec3);

	var resolution = Math.floor(points[0].distanceTo(points[1]) + points[1].distanceTo(points[2]) + points[2].distanceTo(points[3]));

	var vertices = [];
	for (var i = 0 ; i < resolution; i++) {
		vertices[i] = new THREE.Vector3();
	};


	var handles = new THREE.PointCloud(new THREE.Geometry(), pointMaterial);
		handles.geometry.vertices = points;
		handles.geometry.verticesNeedUpdate = true;

	var curveBody = new THREE.Line(new THREE.Geometry());
		curveBody.geometry.vertices = vertices;
		curveBody.geometry.verticesNeedUpdate = true;

	var ctrl1 = new THREE.Line(new THREE.Geometry());
		ctrl1.geometry.verticesNeedUpdate = true;

	var ctrl2 = new THREE.Line(new THREE.Geometry());
		ctrl2.geometry.verticesNeedUpdate = true;

	this.curve = new THREE.Object3D();
	this.curve.add(handles, curveBody, ctrl1, ctrl2);

	var setPoints = function(){
		ctrl1.geometry.vertices[0] = points[1];
		ctrl1.geometry.vertices[1] = points[0];

		ctrl2.geometry.vertices[0] = points[2];
		ctrl2.geometry.vertices[1] = points[3];

		ctrl1.geometry.verticesNeedUpdate = true;
		ctrl2.geometry.verticesNeedUpdate = true;
	}
	setPoints();

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
	setVertices(points, vertices);

	return {
		init : function(){
			this.points = points;
			this.curve = curve;
		},

		move : function(which, vec){
			if(which === 0){
				points[0].add(vec);
				points[1].add(vec);
			} else {
				points[3].add(vec);
				points[2].add(vec);
			}

			setPoints();
			setVertices(points, vertices);
		},

		// Please be advised that this is not quite an intuitive operation
		// in practice. edit the curve handler by setting a absolute 
		// coordinate would be not easy to use. A better way would be 
		// decompose the operation into changing the length/angle incrementally
		// (however this is still not easy to use.) Preferrably to figure
		// out a heuristic approach.
		
		edit : function(which, vec){
			if(which === 0){
				points[1] = vec;
			} else {
				points[2] = vec;
			}
			
			setPoints();
			setVertices(points, vertices);
		},
	}
}