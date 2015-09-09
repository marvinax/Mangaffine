var THREE = require('three');

module.exports = (function(){
	var commandLine = $('#command-line');

	var parseVector = function(string){
		var vec = new THREE.Vector3();
		vec.fromArray(string.split(/[\(\)]/)[1].split(",").map(function(e){return parseFloat(e)}));
		return vec;
	}

	var parseList = function(string){
		return string.split(",").map(function(e){return parseInt(e)});
	}

	var parseCurveSelection = function(container, string, index){
		if (string.match(/[a-z]+(\:(\,[0-9])*[0-9])?/gi).length != 1){
			console.log("invalid selection at "+index);
			return;
		}

		var command = string.split(':');
		var curve = container.getObjectByName(command[0]);

		if (!curve) {
			console.log("didn't find curve at "+index);
			return;
		}

		var indices;
		if(command[1]){
			indices = parseList(command[1]);
		} else {
			indices = [];
			curve.points.forEach(function(e, i){
				indices.push(i);
			})
		}

		return {
			curve : curve,
			indices : indices
		}
	}

	var highlightSelection = function(selection){
		selection.forEach(function(e){
			e.indices.forEach(function(i){
				e.curve.handlePoints.geometry.colors[i].setHex(0xE12D75);
			})
			e.curve.handlePoints.geometry.dispose();
		})
	}

	var basicCommandSet = {
		add : function(container, arguments) {
			if(!arguments[0]){
				console.log("you need to specify the curve name");
				return;
			}

			container.NEWPATHNAME = arguments[0];
			container.ADDING = true;
			container.EDITING = false;
		},

		remove : function(container, arguments) {

			var path, index;
			if(arguments[0] == "path"){
				path = container.getObjectByName(arguments[1]);
				path.dispose();
				container.remove(path);
			} else if (arguments[0] == "point" && arguments[2] == "at"){
				path = container.getObjectByName(arguments[3]);
				index = parseInt(arguments[1]);
				path.removePointAt(index);
			} else {
				console.log("the correct command form is \n"+
					"'remove point <index> atPath <path name>' or \n"+
					"'remove path <path name>'");
			}
		},

		select : function(container, arguments){

			if(arguments[0] == "cancel"){
				container.COMMAND_SELECTED = [];
				container.children.forEach(function(e){
					e.handlePoints.geometry.colors.forEach(function(c){
						c.setHex(0x997584);
					})
				})
			} else {
				console.log(arguments);
				arguments.forEach(function(arg, i){
					container.COMMAND_SELECTED.push(parseCurveSelection(container, arg, i));
				});
			}
			highlightSelection(container.COMMAND_SELECTED);
		},

		apply : function(container, arguments){
			console.log(arguments);

			if(arguments[0] == "trans" && arguments[1] == "along" && arguments[3] == "by"){
				var norm = parseVector(arguments[2]);
				var dist = parseFloat(arguments[4]);
				var move = "trans";
			}

			if(arguments[0] == "rotate" && arguments[1] == "around" && arguments[3] == "by"){
				var norm = parseVector(arguments[2]);
				var dist = parseFloat(arguments[4]);
				var move = "rotate";
			}

				container.COMMAND_SELECTED.forEach(function(o){
					o.curve[move](norm, dist, o.indices);
				})

		}
	}

	return {

		commandSet : {},

		history : [],

		// Match function splits the command into pieces, and
		// identify the command with minimum attempt.
		match : function(command){
			var arguments = command.split(' ');
			this.commandSet[arguments[0]](this.sketch, arguments.slice(1));
		},


		init : function(view){
			this.sketch = view.sketch;

			this.commandSet = basicCommandSet;

			commandLine.on('keydown', function(e){
				if (e.which == 13){
					var command = commandLine.val();
					this.match(command);
					commandLine.val("");	
				}
			}.bind(this))
		}
	}

})();