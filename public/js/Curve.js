var THREE = require('three');

module.exports = (function(){
	var v0 = new THREE.Vector3(),
		v1 = new THREE.Vector3(),
		v2 = new THREE.Vector3(),
		v3 = new THREE.Vector3();

	var resolution, pointList;

	var setPoint = function(){
		for (var i = resolution - 1; i >= 0; i--) {
			var t = i / (resolution - 1);
			var tsq = t*t,
				tcb = tsq*t,
				t_sq = (1-t)*(1-t),
				t_cb = t_sq*(1-t);

			pointList[i].set(
				v0.x * tcb + v1.x * tsq * (1-t) + v2.x * t_sq* t + v3.x * t_cb
			);

		};
	}
})();