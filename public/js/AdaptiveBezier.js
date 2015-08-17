var THREE = require('three');

module.exports = (function() {

	var RECURSION_LIMIT = 5;
	var PATH_DISTANCE_EPSILON =0.05;

	function begin(p1, p2, p3, p4, vertices, distanceTolerance) {
		vertices.push(p1.clone())
		recursive(p1, p2, p3, p4, vertices, distanceTolerance, 0)
		vertices.push(p4.clone())
	}

	function recursive(p1, p2, p3, p4, vertices, distanceTolerance, level) {
		if(level > RECURSION_LIMIT)
			return

		var pi = Math.PI

		var p12   = new THREE.Vector3(),
			p23   = new THREE.Vector3(),
			p34   = new THREE.Vector3(),
			p123  = new THREE.Vector3(),
			p234  = new THREE.Vector3(),
			p1234 = new THREE.Vector3();

		p12.addVectors(p1, p2);
		p12.multiplyScalar(0.5);
		p23.addVectors(p2, p3);
		p23.multiplyScalar(0.5);
		p34.addVectors(p3, p4);
		p34.multiplyScalar(0.5);
		p123.addVectors(p12, p23);
		p123.multiplyScalar(0.5);
		p234.addVectors(p23, p34);
		p234.multiplyScalar(0.5);
		p1234.addVectors(p123, p234);
		p1234.multiplyScalar(0.5);

		
		if(level > 0) { 

			var d = new THREE.Vector3();
				d.subVectors(p4, p1);
			var d_len_sq = d.lengthSq();

			var p2_proj = new THREE.Vector3();
				p2_proj.subVectors(p2, p1);
			var p2_d = p2_proj.clone();
				p2_proj.projectOnVector(d);

			var p3_proj = new THREE.Vector3();
				p3_proj.subVectors(p3, p1);
			var p3_d = p3_proj.clone();
				p3_proj.projectOnVector(d);

			var p2_dist = p2_d.distanceTo(p2_proj),
				p3_dist = p3_d.distanceTo(p3_proj);

			
			if((p2_dist+p3_dist) * (p2_dist+p3_dist) <= distanceTolerance * d_len_sq) {
				vertices.push(p1234);
				return;
			}
		}

		// Continue subdivision
		//----------------------
		recursive(p1, p12, p123, p1234, vertices, distanceTolerance, level + 1) 
		recursive(p1234, p234, p34, p4, vertices, distanceTolerance, level + 1) 

	}

	return {
		bezierCurve : function(p1, p2, p3, p4) {
			var vertices = []
			var distanceTolerance = PATH_DISTANCE_EPSILON * PATH_DISTANCE_EPSILON
			begin(p1, p2, p3, p4, vertices, distanceTolerance)
			console.log(vertices);
			return vertices
		}
	}
})();