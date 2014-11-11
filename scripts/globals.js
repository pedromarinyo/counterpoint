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
	//Icons
	add: 				"./assets/icons/icon_add_small.png",
	branch: 			"./assets/icons/icon_branch_small.png",
	interpretEvent: 	"./assets/icons/icon_interpret_small.png",
	recordEvent: 		"./assets/icons/icon_event_small.png",
	//Images
	msw: 				"./assets/images/mswFade.png",
	got: 				"./assets/images/gotFade.png",
	vods: 				"./assets/images/vodsFade.png"
};

//Loading array of image objects.
for (var src in imagePaths) {
    images[src] = new Image();
    images[src].src = imagePaths[src];
}

//For testing...
//Detailed in data.js.
var argumentsFromDatabase, topicsFromDatabase; 

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

  	editor.argumentGroup.on('dragend', function() {
  		var i = Math.floor(Math.abs((this.getAbsolutePosition().y - (sh/3)) / 250));
  		var topic = editor.arguments[i].topicHandle;

  		if(editor.currTopic != topic) {
  			editor.changeBgImg(topic);
  			editor.currTopic = topic;
  		}
  	});

  	//Argument events
  	var answerNodeArray = new Array();
  	for (i = 0; i < editor.arguments.length; i++) {
  		(function(i){
	  		editor.arguments[i].answerNode.on('dragend', 
	  			function() { 
		  			if(this.getAbsolutePosition().x > 90) {
		  				editor.expandArgument(editor.arguments[i]);
		  				//setTimeout(function() {editor.arguments[i].returnAnswerNode(this);}, 500); 
		  			}
		  			else { editor.arguments[i].returnAnswerNode(this); }
	  			}
	  		);
	  	}(i));
  	}

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