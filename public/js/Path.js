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

	var selected = false;

	return {
		init : function(){
			this.path = path;
		},

		add : function(vec){
			if(curves.length > 0){
				var last = curves.length - 1,
					lastPoint = curves[last].points[3];

				curves[last].set(1, vec);

				curves.push(Curve(lastPoint.clone(), lastPoint.clone(), vec.clone(), vec.clone()));
				curves[last+1].init();
				path.add(curves[last+1].curve);
			} else {
				curves.push(Curve(vec.clone(), vec.clone(), vec.clone(), vec.clone()));
				curves[0].init();
				path.add(curves[0].curve);
			}
		},

		addLast : function(vec){
			curves[curves.length-1].set(1, vec);
		},

		set : function(which, vector){
			if( which < curves.length ){
				console.log(which);
				curves[which].set(0, vector);
			}

			if( which > 0 ){
				console.log(which);
				curves[which - 1].set(1, vector);
			}
		},

		move : function(which, vector){
			if(which === 0)
				curves[0].move(0, vector);

			if(which > 0)
				curves[which-1].move(1, vector);

			if(which < curves.length - 1)
				curves[which].move(0, vector);

			if(which === curves.length - 1)
				curves[which].move(1, vector);

		},

		edit : function(which, vector){
			var negate = vector.clone();
				negate.negate();

			if( which < curves.length ){
				curves[which].edit(0, vector);
			}

			if( which > 0 ){
				curves[which - 1].edit(1, negate);
			}
				
		}

	}
}