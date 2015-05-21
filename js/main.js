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

var commands = {
	'freedraw' : function(){
		console.log("paper.project");
	}
}

$("#command-line").keyup(function(e){ 
	if( e.which == 13 ){
    	e.preventDefault();
    	commands[$("#command-line").val()];
    }
});

var initTools = function() {
	var currentPath;

	tools['freedraw'].tool
	.on("mousedown", function(e){
		if(currentPath){
			currentPath.fullySelected = false;
		}
		currentPath = new paper.Path();
		currentPath.strokeColor = 'black';
		currentPath.add(e.point);
	})
	.on("mousedrag", function(e){
		currentPath.add(e.point);
	})
	.on("mouseup", function(e){
		currentPath.simplify(15);
		currentPath.fullySelected = true;
	});
}

window.onload = function() {
	var canvas = document.getElementById('paper-canvas');
	
	canvas.height = window.innerHeight * window.devicePixelRatio;
	canvas.width = window.innerWidth * window.devicePixelRatio;
	canvas.style.height = window.innerHeight + "px";
	canvas.style.width = window.innerWidth + "px";

	$('#command-line').focus();

	paper.setup(canvas);
	initTools();
}