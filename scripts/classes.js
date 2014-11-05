//Editor Class
//_________________________________
function Editor() {
	this.bg; //editor_layer background	
	this.toolbox; //Toolbox group.
	this.toolboxIsOpen = false;
	
	this.add; //Toolbox icons.
	this.branch;
	this.interpretEvent;
	this.recordEvent;
	
	this.openToolbox; //Tweens.
	this.rotateAdd;

    //Initialize the editor pane
    this.init = function init() {

    	//Creating editor_layer.
    	editor_layer = new Kinetic.Layer(); //Create editor layer

    	//Background rect, color
    	this.bg = new Kinetic.Rect({
	        x: 					0,
	        y: 					0,
	        width: 				sw,
	        height: 			sh,
	        fill: 				'#333333'
	    });
	    editor_layer.add(this.bg);

    	//Creating toolbox group (i.e. add, branch, interpret and record event). 
    	this.toolbox = new Kinetic.Group(); 
    	this.add = new Kinetic.Image({ 
			x: 					50,
			y: 					50,
			offsetX: 			50,
			offsetY: 			50,
 			image:  			images["add"],
 			width: 				100,
 			height: 			100,
 			shadowColor: 		'black',
          	shadowOffset: 		{x: 5,y: 10},
          	shadowOpacity: 		0.5
	    }); 
	    editor_layer.add(this.add);

	    var toolboxArray = [this.branch, this.recordEvent, this.interpretEvent];
	    var srcArray = ["branch", "recordEvent", "interpretEvent"];
	    for (var i = 0; i < toolboxArray.length; i++) {
	    	toolboxArray[i] = new Kinetic.Image({
	    		x: 					-100,
				y: 					(i * 75) + 130,
				offsetX: 			50,
				offsetY: 			50,
 				image:  			images[srcArray[i]], 
 				shadowColor: 		'black',
		        shadowOffset: 		{x: 5,y: 10},
		        shadowOpacity: 		0.2,
		        draggable: 			true
	    	});
	    	this.toolbox.add(toolboxArray[i]);
	    }
	    this.branch = toolboxArray[0];
	    this.recordEvent = toolboxArray[1];
	    this.interpretEvent = toolboxArray[2];

	    //Adding groups to editor_layer, adding editor_layer onto stage
	    editor_layer.add(this.toolbox); 
	    stage.add(editor_layer);

	    //Preparing toolbox tweens.
      	this.openToolbox = new Kinetic.Tween({
	        node: 			this.toolbox, 
	        duration: 		0.2,
	        easing: 		Kinetic.Easings["EaseOut"],
	        x: 				150
      	});
      	this.rotateAdd = new Kinetic.Tween({
	        node: 			this.add, 
	        duration: 		0.2,
	        easing: 		Kinetic.Easings["EaseOut"],
	        rotation: 		45
      	});

	    return true;
	}
    
    this.showToolbox = function showToolbox() {
        this.openToolbox.play();
        this.rotateAdd.play();
        this.toolboxIsOpen = true;
        return true;
    }

    this.hideToolbox = function hideToolbox() {
    	this.openToolbox.reverse(); 
    	this.rotateAdd.reverse();
    	this.toolboxIsOpen = false;
    	return true;
    }

    this.returnToToolbox = function returnToToolbox(node) {
    	//Return node to toolbox.
    	switch (node) {
    		case this.branch:
    			i = 0;
    			break;
    		case this.recordEvent:
    			i = 1;
    			break;
    		case this.interpretEvent:
    			i = 2;
    			break;
    	}
    	var returnToToolbox = new Kinetic.Tween({
    		node: 			node,
    		x: 				-100,
    		y: 				(i * 75) + 130,
    		duration: 		.01
    	});

    	//Shrink node.
    	var shrink = new Kinetic.Tween({
    		node: 			node,
    		scaleX: 		.01,
    		scaleY: 		.01,
    		duration: 		.1
    	});

    	shrink.play();

    	//Return to toolbox
    	setTimeout(function() {
    		returnToToolbox.play();
    		shrink.reverse();
    	}, 300);
    }
}

//Node Class
//_________________________________
function Node(name, author, description, type) {
	this.name 			= name; //Name.
	this.author 		= author; //Name of the node's author.
	this.description 	= description; //Textual description; displayed in inspector view.
	this.type			= type; //Node type: image, link (online article, etc.), or video. 

	this.evidence; //Array of evidence nodes.
	this.dispute; //Array of dispute nodes. 
	
}

//Inspector Class
//_________________________________
function Inspector() {
	//Initialize the inspector pane
	this.init = function init() {
		//Create inspector layer
		inspector_layer = new Kinetic.Layer();
	}
}

