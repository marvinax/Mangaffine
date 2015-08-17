var THREE = require('three');
var AdaptiveBezier = require('./AdaptiveBezier.js');

var pointMaterial = new THREE.PointCloudMaterial({
	side : THREE.DoubleSide,
	// transparent : true,
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
	var points = [];
		points.push(vec0, vec1, vec2, vec3);

	var handles = new THREE.PointCloud(new THREE.Geometry(), pointMaterial);
		handles.geometry.vertices = points;
		handles.geometry.verticesNeedUpdate = true;

	var curveBody = new THREE.PointCloud(new THREE.Geometry());
		curveBody.geometry.verticesNeedUpdate = true;

	var ctrl1 = new THREE.Line(new THREE.Geometry());
		ctrl1.geometry.verticesNeedUpdate = true;

	var ctrl2 = new THREE.Line(new THREE.Geometry());
		ctrl2.geometry.verticesNeedUpdate = true;

	var curve = new THREE.Object3D();
		curve.add(handles, curveBody, ctrl1, ctrl2);

	var setPoints = function(){
		ctrl1.geometry.vertices[0] = points[1];
		ctrl1.geometry.vertices[1] = points[0];

		ctrl2.geometry.vertices[0] = points[2];
		ctrl2.geometry.vertices[1] = points[3];

		ctrl1.geometry.verticesNeedUpdate = true;
		ctrl2.geometry.verticesNeedUpdate = true;
	}
	setPoints();

	var setVertices = function(p){
		curveBody.geometry.vertices = AdaptiveBezier.bezierCurve(p[0], p[1], p[2], p[3]);
		curveBody.geometry.verticesNeedUpdate = true;
	}
	setVertices(points);

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
			setVertices(points);
		},

		// Please be advised that this is not quite an intuitive operation
		// in practice. edit the curve handler by setting a absolute 
		// coordinate would be not easy to use. A better way would be 
		// decompose the operation into changing the length/angle incrementally
		// (however this is still not easy to use.) Preferrably to figure
		// out a heuristic approach.
		
		edit : function(which, vec){
			if(which === 0){
				points[1] = points[0].add(vec);
			} else {
				points[2] = points[3].add(vec);
			}
			
			setPoints();
			setVertices(points);
		},
	}
}