module.exports = (function(){
	var commandLine = $('#command-line');

	// var basicCommandSet = 

	return {

		stub : {},

		commandSet : [],

		history : [],

		// Match function splits the command into pieces, and
		// identify the command with minimum attempt.
		match : function(command){
			var arguments = command.split(' ');
			console.log(arguments);
		},


		init : function(view){
			this.stub.rndr = view.rndr;
			this.stub.camera = view.camera;
			this.stub.scene = view.scene;
			this.stub.ctrl = view.ctrl;
			this.stub.sketch = view.sketch;

			commandLine.on('keydown', function(e){
				if (e.which == 13){
					var command = commandLine.val();
					this.match(command);
				}
			}.bind(this))
		}
	}

})();