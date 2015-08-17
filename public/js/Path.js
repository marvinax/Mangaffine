var THREE = require('three');
var Curve = require('./Curve.js');

module.exports = function(){
	
	/**
	 * holding curve instances, generated from waypoints
	 * @type {Array}
	 */
	var curves = [];

	/**
	 * holds all curve objects. Should be exposed to outside.
	 * @type {THREE}
	 */
	var path = new THREE.Object3D();

	return {
		add : function(vec){
			if(curves.length > 1){
				var last = curves.length - 1,
					lastPoint = curves[last][3];

				curves.push(Curve(lastPoint.clone(), lastPoint.clone(), vec.clone(), vec.clone()));
				curves[last+1].init();
				path.add(curves[last+1].curve);
			} else {
				curves.push(Curve(vec.clone(), vec.clone(), vec.clone(), vec.clone()));
				curves[0].init();
			}
		},

		move : function(which, vector){
			if(which > 0)
				curves[which-1].move(vector);

			if(which < waypoints.length - 2)
				curves[which].move(vector);

		},

		edit : function(which, vector){
			if(!vector){
				vector = new THREE.Vector3(0, 0, 0);
			}
			if(which > 0)
				curves[which-1].edit(vector)
			}
		}

	}
}