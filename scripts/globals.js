//Global Variables
//_________________________________
var stage;
var stage_state = "root";

var sw = 1024; //Screen width
var sh = 768; //Screen height

var editor, inspector;
var editor_layer, inspector_layer; 

var images = new Array();
var imagePaths = {
	add: 				"./assets/icons/icon_add_small.png",
	branch: 			"./assets/icons/icon_branch_small.png",
	interpretEvent: 	"./assets/icons/icon_interpret_small.png",
	recordEvent: 		"./assets/icons/icon_event_small.png"
};

//Loading array of image objects.
for (var src in imagePaths) {
    images[src] = new Image();
    images[src].src = imagePaths[src];
}

//Global Functions
//__________________________________
function init() {
	//Creating...
	//Stage
	stage = new Kinetic.Stage({
		container: "stage",
		width: sw,
		height: sh
	});  

	//Editor
	editor = new Editor();
	editor.init();

	//Inspector
	//inspector = new Inspector();
	//inspector.init();

	//Begin listening for events.
	bindEvents();

	return true;
}

function bindEvents() {
	//Editor events
	editor.add.on('tap mouseup', function() { //Editor's "add" button implementation.
  		if (editor.toolboxIsOpen) {editor.hideToolbox();}
  		else {editor.showToolbox();}
  	});

	//Toolbox events
	var toolboxItems = [editor.branch, editor.interpretEvent, editor.recordEvent];
	for (i = 0; i < toolboxItems.length; i++) {
	  	toolboxItems[i].on('dragend', function() {editor.returnToToolbox(this);});
	}
  	
}

/*
Database configuration
---
Arguments consist of:
	Name
	Author
	Author portrait
	Main question
	Main answer
		Argument branches
			Event nodes
			Interpretation nodes
				Evidence nodes
				Dispute nodes

Interface configuration
---
Add:
	Branch
	Event
	Thought/Interpretation
*/