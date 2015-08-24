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

	var vertices = [];
	for(var i = 0; i <= STEPS; i++){
		vertices.push(new THREE.Vector3());
	}

	function init(p1, p2, p3, p4){
		// console.log("---init---")
		f.copy(p1);
		// console.log(f);
		
		fd.subVectors(p2, p1);
		fd.multiplyScalar(3*t);
		// console.log(fd);

		fdd_per_2.addVectors(p1, p3);
		fdd_per_2.sub(p2);
		fdd_per_2.sub(p2);
		fdd_per_2.multiplyScalar(3*temp);
		// console.log(fdd_per_2);

		fddd_per_2.subVectors(p2, p3);
		fddd_per_2.multiplyScalar(3);
		fddd_per_2.add(p4);
		fddd_per_2.sub(p1);
		fddd_per_2.multiplyScalar(3*temp*t);

		fddd.addVectors(fddd_per_2, fddd_per_2);
		fdd.addVectors(fdd_per_2, fdd_per_2);
		fddd_per_6.copy(fddd_per_2);
		fddd_per_6.multiplyScalar(1/3);
	}

	function update(){
		// console.log('---update---');
		f.addVectors(f, fd);
		// console.log(f);

		f.add(fdd_per_2);
		f.add(fddd_per_6);

		fd.addVectors(fd, fdd);
		fd.add(fddd_per_2);
		
		fdd.addVectors(fdd, fddd);
		
		fdd_per_2.addVectors(fdd_per_2, fddd_per_2);
	}

	function bezierCurve(p1, p2, p3, p4){
		vertices = [];
		init(p1, p2, p3, p4);
		for(var i = 0; i <= STEPS; i++){
			vertices.push(f.clone());
			update();
		}

		return vertices;
	}

	return bezierCurve;
})();