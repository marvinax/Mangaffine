var THREE = require('three');

module.exports = function createBezierBuilder(opt) {
	opt = opt||{}

	var RECURSION_LIMIT = typeof opt.recursion === 'number' ? opt.recursion : 8
	var FLT_EPSILON = typeof opt.epsilon === 'number' ? opt.epsilon : 1.19209290e-7
	var PATH_DISTANCE_EPSILON = typeof opt.pathEpsilon === 'number' ? opt.pathEpsilon : 1.0

	var curve_angle_tolerance_epsilon = typeof opt.angleEpsilon === 'number' ? opt.angleEpsilon : 0.01
	var m_angle_tolerance = opt.angleTolerance || 0
	var m_cusp_limit = opt.cuspLimit || 0

	return function bezierCurve(start, c1, c2, end, scale, points) {
		if (!points)
			points = []

		scale = typeof scale === 'number' ? scale : 1.0
		var distanceTolerance = PATH_DISTANCE_EPSILON / scale
		distanceTolerance *= distanceTolerance
		begin(start, c1, c2, end, points, distanceTolerance)
		return points
	}

	function begin(start, c1, c2, end, points, distanceTolerance) {
		points.push(start.clone())
		recursive(start, c1, c2, end, points, distanceTolerance, 0)
		points.push(end.clone())
	}

	function recursive(start, c1, c2s, points, distanceTolerance, level) {
		if(level > RECURSION_LIMIT)
			return

		var pi = Math.PI

		var p12   = new THREE.Vector3(),
			p23   = new THREE.Vector3(),
			p34   = new THREE.Vector3(),
			p123  = new THREE.Vector3(),
			p234  = new THREE.Vector3(),
			p1234 = new THREE.Vector3();

		p12.addVector2(start, c1);
		p12.multScalar(0.5);
		p23.addVector2(c1, c2);
		p23.multScalar(0.5);
		p34.addVector2(c2, end);
		p34.multScalar(0.5);

		if(level > 0) { // Enforce subdivision first time

			var d = new THREE.Vector3();
				d.subVector(end, start);
			var d_len_sq = d.lengthSq();

			var c1_proj = new THREE.Vector3();
				c1_proj.subVector(c1, start);
				c1_proj.projectOnVector(d);

			var c2_proj = new THREE.Vector3();
				c2_proj.subVector(c2, start);
				c2_proj.projectOnVector(d);

			var c1_dist = c2.distanceTo(c1_proj),
				c2_dist = c2.distanceTo(c2_proj);

			var da1, da2

				if(c1_dist > FLT_EPSILON) {
					// p1,p3,p4 are collinear, p2 is considerable
					//----------------------
					if(c1_dist * c1_dist <= distanceTolerance * d_len_sq) {
						if(m_angle_tolerance < curve_angle_tolerance_epsilon) {
							points.push(vec2(x1234, y1234))
							return
						}

						// Angle Condition
						//----------------------
						da1 = Math.abs(Math.atan2(y3 - y2, x3 - x2) - Math.atan2(y2 - y1, x2 - x1))
						if(da1 >= pi) da1 = 2*pi - da1

						if(da1 < m_angle_tolerance) {
							points.push(vec2(x2, y2))
							points.push(vec2(x3, y3))
							return
						}

						if(m_cusp_limit !== 0.0) {
							if(da1 > m_cusp_limit) {
								points.push(vec2(x2, y2))
								return
							}
						}
					}
				}
				else if(c2_dist > FLT_EPSILON) {
					// p1,p2,p4 are collinear, p3 is considerable
					//----------------------
					if(d3 * d3 <= distanceTolerance * (dx*dx + dy*dy)) {
						if(m_angle_tolerance < curve_angle_tolerance_epsilon) {
							points.push(vec2(x1234, y1234))
							return
						}

						// Angle Condition
						//----------------------
						da1 = Math.abs(Math.atan2(y4 - y3, x4 - x3) - Math.atan2(y3 - y2, x3 - x2))
						if(da1 >= pi) da1 = 2*pi - da1

						if(da1 < m_angle_tolerance) {
							points.push(vec2(x2, y2))
							points.push(vec2(x3, y3))
							return
						}

						if(m_cusp_limit !== 0.0) {
							if(da1 > m_cusp_limit)
							{
								points.push(vec2(x3, y3))
								return
							}
						}
					}
				}
				else {
					// Collinear case
					//-----------------
					dx = x1234 - (x1 + x4) / 2
					dy = y1234 - (y1 + y4) / 2
					if(dx*dx + dy*dy <= distanceTolerance) {
						points.push(vec2(x1234, y1234))
						return
					}
				}
			}
		}

		// Continue subdivision
		//----------------------
		recursive(x1, y1, x12, y12, x123, y123, x1234, y1234, points, distanceTolerance, level + 1) 
		recursive(x1234, y1234, x234, y234, x34, y34, x4, y4, points, distanceTolerance, level + 1) 
	}
}