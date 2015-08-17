var THREE = require('three');

module.exports = function(vec){
	point = vec;
	controls = [vec.clone(), vec.clone()];

	return {
		translate : function(vector){
			point.add(vector);
			controls[0].add(vector);
			controls[1].add(vector);
		},

		setControl : function(freeform, which, vector){
			var distance = new THREE.Vector3();
			controls[which].set(vector);
			if(!freeform){
				var distRatio = point.distanceTo(controls[1-which])/point.distanceTo(controls[which]);
				distance.subVector(controls[which], point);
				distance.multiplyScalar(distRatio)
				controls[1-which].subVectors(point, distance);
			}
		}
	}
}

