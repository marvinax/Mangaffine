var tools = {
	'freedraw' : {
		tool : new paper.Tool(),
		name : "Free Drawing",
		desc : "Path will be auto-simplified"
	},
	'path' : {
		tool : new paper.Tool(),
		name : "Path",
		desc : "Ordinary path tool that enables you to manipulate the control points"
	}
}

var initTools = function() {
	var path;

	tools['freedraw'].tool.onMouseDown = function(e){
		path = new paper.Path();
		path.strokeColor = 'black';
		path.add(e.point);
	};

	tools['freedraw'].tool.onMouseDrag = function(e){
		path.add(e.point);
	}

	tools['freedraw'].tool.onMouseUp = function(e){
		path.simplify(15);
	}

	tools['freedraw'].tool.activate();
}

window.onload = function() {
	var canvas = document.getElementById('paper-canvas');
	canvas.height = window.innerHeight;
	canvas.width = window.innerWidth;


	paper.setup(canvas);
	initTools();
}