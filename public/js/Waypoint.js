var THREE = require('three');

module.exports = function(vec){
	var point = vec;
	var controls = [vec.clone(), vec.clone()];

	return {
		init : function(){
			this.point = point;
			this.controls = controls;
		},

		move : function(vector){
			point.add(vector);
			controls[0].add(vector);
			controls[1].add(vector);
		},

		edit : function(freeform, which, vector){
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

