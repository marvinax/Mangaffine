var THREE = require('three');

var pointMaterial = new THREE.PointCloudMaterial({
	size : 20,
	color : 0xef049d
})

module.exports = (function(){
	return {
		move : function(event, ctrl, intersections){
			// do nothing yet
		},
		down : function(event, ctrl, intersections){
			if (event.shiftKey){
				ctrl.enabled = false;
				console.log("yay");
			}
		},
		up : function(event, ctrl, intersections){
			ctrl.enabled = true;
		}
	}
})();