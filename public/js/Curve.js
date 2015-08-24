var THREE = require('three');
var ForwardDiffBezier = require('./ForwardDiffBezier.js');

var colors = {
	darker : 0x01723F,
	dark : 0x0A9154,
	medium : 0x23A76B,
	light : 0x40B580,
	lighter : 0x69CDA0
};

var handlePointMaterial = new THREE.PointCloudMaterial({
	side : THREE.DoubleSide,
	color : colors.darker,
	opacity : 0.8,
	size : 2
});

var curveBodyPointMaterial = new THREE.PointCloudMaterial({
	alphaTest : 0.5,
	side : THREE.DoubleSide,
	color : colors.dark,
	transparent : true,
	opacity : 0.5,
	size : 1,
});

var curveBodyMaterial = new THREE.LineBasicMaterial({
	side : THREE.DoubleSide,
	color : colors.medium,
	transparent : true,
	opacity : 0.5
}); 

var handleBarMaterial = new THREE.LineBasicMaterial({
	side : THREE.DoubleSide,
	color : colors.dark,
	transparent : true,
	opacity : 0.5
})

module.exports = function(vec0, vec1, vec2, vec3){
	/**
	 * Points array is used to generate the Bezier curve. Make sure
	 * that only Vector3 reference is passed in.
	 * @type {Array}
	 */
	var points = [];
		points.push(vec0, vec1, vec2, vec3);

	var handles = new THREE.PointCloud(new THREE.Geometry(), handlePointMaterial);
		handles.geometry.vertices = points;
		handles.geometry.verticesNeedUpdate = true;

	var curveBody = new THREE.Line(new THREE.Geometry(), curveBodyMaterial);
		curveBody.geometry.verticesNeedUpdate = true;

	var ctrl1 = new THREE.Line(new THREE.Geometry(), handleBarMaterial);
		ctrl1.geometry.verticesNeedUpdate = true;

	var ctrl2 = new THREE.Line(new THREE.Geometry(), handleBarMaterial);
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
		curveBody.geometry.vertices = ForwardDiffBezier(p[0], p[1], p[2], p[3]);
		curveBody.geometry.verticesNeedUpdate = true;
	}
	setVertices(points);

	return {
		init : function(){
			this.points = points;
			this.curve = curve;
		},

		remove : function(){

		},

		set : function(which, vec){
			if(which === 0){
				points[0].copy(vec);
				points[1].copy(vec);
			} else if (which === 1){
				points[3].copy(vec);
				points[2].copy(vec);
			}
			curve.remove(curveBody);
			setPoints();
			setVertices(points);
			curve.add(curveBody);
		},

		move : function(which, vec){
			if(which === 0){
				points[0].add(vec);
				points[1].add(vec);
			} else if (which === 1){
				points[3].add(vec);
				points[2].add(vec);
			}
			curve.remove(curveBody);
			setPoints();
			setVertices(points);
			curve.add(curveBody);
		},
		
		edit : function(which, vec){
			if(which === 0){
				points[1].addVectors(points[0], vec);
			} else if (which === 1 ){
				points[2].addVectors(points[3], vec);
			}
			
			curve.remove(curveBody);
			setPoints();
			setVertices(points);
			curve.add(curveBody);
		},
	}
}