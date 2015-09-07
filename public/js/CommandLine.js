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
		if (string.match(/[a-z]+\:(\,[0-9])*[0-9]/gi).length != 1){
			console.log("invalid selection at "+index);
			return;
		}

		var command = string.split(':');
		var curve = container.getObjectByName(command[0]);
		console.log(curve);
		if (!curve) {
			console.log("didn't find curve at "+index);
			return;
		}

		var indices = parseList(command[1]);

		return {
			curve : curve,
			indices : indices
		}
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
			var allSelection = [];
			arguments.forEach(function(arg, i){
				allSelection.push(parseCurveSelection(container, arguments[0], i));
			});
		}
	}

	return {

		stub : {},

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