

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

var selectedPaths = [];
var currentDrawingPath;

$("#command-line").keyup(function(e){ 
	if( e.which == 13 ){
    	e.preventDefault();
    	var command = $("#command-line").val();
    	if(tools[command]){
    		tools[command].tool.activate();
    		$('#status-bar').html("<b>"+tools[command].name+":</b> "+tools[command].desc);
    	}
    	$("#command-line").val("");
    }
});

var initTools = function() {
	tools['freedraw'].tool
	.on("mousedown", function(e){
		currentDrawingPath = new paper.Path();
		currentDrawingPath.strokeColor = 'black';
		currentDrawingPath.add(e.point);
	})
	.on("mousedrag", function(e){
		currentDrawingPath.add(e.point);
	})
	.on("mouseup", function(e){
		currentDrawingPath.simplify(15);
		currentDrawingPath.fullySelected = true;
	});

	tools['path'].tool
	.on('mouseup', function( e ){
		var hitResult = paper.project.hitTest( e.point, {
			segments:  true,
			fill:      false,
			stroke:    true,
			handles:   true,
			tolerance: 8
		});

		paper.project.deselectAll();
		if( hitResult ) {
			var hittedPathIndex = selectedPaths.indexOf(hitResult.item);
			console.log(hittedPathIndex);
			if(hittedPathIndex == -1){
				selectedPaths.push(hitResult.item);
			} else {
				selectedPaths.splice(0, hittedPathIndex);
				hitResult.item.fullySelected = false;
			}
		} else {
			selectedPaths.forEach(function(path){
				path.fullySelected = false;
			})
			selectedPaths = [];
		}

		selectedPaths.forEach(function(path){
			path.fullySelected = true;
		})

	})
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