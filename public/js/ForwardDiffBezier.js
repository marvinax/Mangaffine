var THREE = require('three');

module.exports = (function(){
	var SCALE = 5,
		STEPS = 1<<SCALE;

	var f			= new THREE.Vector3(),
		fd			= new THREE.Vector3(),
		fdd			= new THREE.Vector3(),
		fddd		= new THREE.Vector3(),
		fdd_per_2	= new THREE.Vector3(),
		fddd_per_2	= new THREE.Vector3(),
		fddd_per_6	= new THREE.Vector3();
	var t			= 1.0 / STEPS;
	var temp 		= t * t;

	function initComponent(which, p1, p2, p3, p4){
		var p_1 = p1[which],
			p_2 = p2[which],
			p_3 = p3[which],
			p_4 = p4[which];

		f[which]			= p_1;
		fd[which] 			= 3 * t * ( p_2 - p_1 );
		fdd_per_2[which]	= 3 * temp * ( p_1 + p_3 - 2* p_2 );
		fddd_per_2[which]	= 3 * temp * t * ( 3 * ( p_2 - p_3 ) + p_4 - p_1 );
		fddd[which]			= 2 * fddd_per_2[which];
		fdd[which]			= 2 * fdd_per_2[which];
		fddd_per_6[which]	= fddd_per_2[which] / 3;
	}

	function updateComponent(which){
		f[which]			+= fd[which] + fdd_per_2[which] + fddd_per_6[which];
		fd[which]			+= fdd[which] + fddd_per_2[which];
		fdd[which]			+= fddd[which];
		fdd_per_2[which]	+= fddd_per_2[which];
	}

	function bezierCurve(points){
		var vertices = [];
		initComponent("x", points[0], points[1], points[2], points[3]);
		initComponent("y", points[0], points[1], points[2], points[3]);
		initComponent("z", points[0], points[1], points[2], points[3]);
		for(var i = 0; i <= STEPS; i++){
			vertices.push(f.clone());
			updateComponent("x");
			updateComponent("y");
			updateComponent("z");
		}

		return vertices;
	}

	return bezierCurve;
})();