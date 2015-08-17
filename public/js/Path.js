var THREE = require('three');
var Curve = require('./Curve.js');

module.exports = function(){
	
	/**
	 * holding curve instances, generated from waypoints
	 * @type {Array}
	 */
	var curves = [];

	/**
	 * waypoints are generated from commandlines
	 * @type {Array}
	 */
	var waypoints = [];

	var editingMode = "";

	return {
		init : function(vecArray){
			if(vecArray.length > 1){			
				vecArray.forEach(e){
					waypoints.push(new WayPoint(e));
				}

				for(var i = 0; i < waypoints.length - 1; i++){
					curves.push()
				}
			}
		}
	}
}