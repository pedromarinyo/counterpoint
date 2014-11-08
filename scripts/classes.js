//Editor Class
//_________________________________
function Editor() {
	this.bg; //editor_layer background.
	this.bgImg; //editor_layer background image.
	this.argumentGroup; //Group of argument visual assets. 
	this.arguments = new Array(); //Array of loaded arguments. 
	this.toolbox; //Toolbox group.
	this.toolboxIsOpen = false;
	this.currTopic = "msw";
	
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
	        height: 			sh * 2,
	        fill: 				'#625e57'
	    });

	    this.bgImg = new Kinetic.Image({
	    	x: 					sw,
	    	y: 					0,
	    	offsetX: 			600,
	    	image: 				images["msw"]
	    });

    	//Creating toolbox group (i.e. add, branch, interpret and record event). 
    	this.toolbox = new Kinetic.Group(); 
    	this.add = new Kinetic.Image({ 
			x: 					50,
			y: 					50,
			offsetX: 			50,
			offsetY: 			50,
 			image:  			images["add"],
 			width: 				100,
 			height: 			100
 			//shadowColor: 		'black',
          	//shadowOffset: 		{x: 5,y: 10},
          	//shadowOpacity: 		0.5
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
	        rotation: 		45
      	});

      	//Creating argument group and adding background.
    	this.argumentGroup = new Kinetic.Group();
    	

    	//Loading arguments for testing.
		this.loadArguments(argumentsFromDatabase);
		for (i = 0; i < this.arguments.length; i++) {
			this.argumentGroup.add(this.arguments[i].drawArgument());	
		}
		
		editor_layer.add(this.bg); this.bg.setZIndex(0);
		editor_layer.add(this.bgImg); this.bgImg.setZIndex(1); 
		
		this.argumentGroup.setAttrs({
			x: 				0,
			y: 				0,
			draggable: 		true,
			dragBoundFunc: 	function(pos) {
				if (pos.y > 0) {return {x: this.getAbsolutePosition().x, y: this.getAbsolutePosition().y};}
				else {return {x: this.getAbsolutePosition().x, y: pos.y};}
			}
		});
		editor_layer.add(this.argumentGroup);  this.argumentGroup.setZIndex(2);

	    return true;
	}
    
    //Toolbox controls
    this.showToolbox = function showToolbox() {
        this.toolbox.setZIndex(5);
        this.add.setZIndex(5);
        this.openToolbox.play();
        this.rotateAdd.play();
        this.toolboxIsOpen = true;
        return true;
    }

    this.hideToolbox = function hideToolbox() {
    	this.openToolbox.reverse(); 
    	this.rotateAdd.reverse();
    	this.add.setZIndex(5);
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

    this.changeBgImg = function changeBgImg(imgString) {
    	var image = images[imgString];
    	var fade = new Kinetic.Tween({
    		node: 			this.bgImg, 
	        duration: 		0.2,
	        opacity: 		0
    	});
    	fade.play();
    	
    	setTimeout(function(){
    		editor.bgImg.setImage(image);
    		fade.reverse();	
    	}, 500);

    	
    }

    //Argument and node management
    this.loadArguments = function loadArguments(jsonArgument) {
    	//If recieving data from database, parse argument from JSON string.
    	//var argument = JSON.parse(jsonArgument);
    	var argumentsObj = jsonArgument; //For testing.
    	var y = 250;
    	var i = 1;
    	var topicFlag = false;
    	var currTopic;

    	for (argument in argumentsObj) {
    		
    		if(currTopic != argumentsObj[argument].topic) {
    			currTopic = argumentsObj[argument].topic;
    			topicFlag = true;
    		}
    		else {
    			topicFlag = false;
    		}

    		this.arguments.push(new Argument(argumentsObj[argument], (y * i), topicFlag));
    		i++;
    	}
    }
}

//Argument Class
//_________________________________
function Argument(argument, y, topicFlag) {
	this.name 			= argument.name; //Name of the argument.
	this.author 		= argument.author; //Name of the argument's author.
	this.lastModified 	= argument.lastModified;
	this.updateFlags	= argument.updateFlags;
	this.topic 			= argument.topic; //Topic of the argument, i.e. "How to Get Away with Murder", etc.
	this.topicHandle 	= argument.topicHandle;
	this.questionText 	= argument.question; //Author's proposed question.
	this.answerText 	= argument.answer; //Author's proposed solution.
	this.y 				= y; //Arguments y coordinate.
	this.topicFlag 		= topicFlag;

	this.argumentGroup 	= new Kinetic.Group(); //Stores all visual assets, i.e. question and answer nodes, branches.
	this.questionNode 	= new Kinetic.Group();
	this.answerNode 	= new Kinetic.Group();
	this.label 			= new Kinetic.Group();
	this.flags 			= new Kinetic.Group();
	
	this.branches; //Array of branch objects. 

	//Create node
	this.createNode = function createNode(text, type) {
		var radius, x, fontSize, color, colorLibrary, colorPallet;
		var handle = new Kinetic.Group();

		colorLibrary = {
			"msw": ["#cc9933", "#b18e47"],
			"got": ["#115c81", "#425d77"],
			"vods": ["#815d24", "#725b35"]
		};

		switch (this.topic) {
			case "Murder She Wrote":
				colorPallet = colorLibrary.msw;
				break;
			case "Game of Thrones":
				colorPallet = colorLibrary.got;
				break;
			case "Voices of a Distant Star":
				colorPallet = colorLibrary.vods;
				break;
		}

		switch (type) {
			case "question":
				radius = 80; 
				x = 250; 
				fontSize = 12;
				color = colorPallet[0]; 
				break;
			case "answer":
				radius = 80; 
				x = 350; 
				fontSize = 12; 
				color = colorPallet[1];
				break;
			case "event":
				radius = 60; 
				x = 100; 
				fontSize = 12; 
				break;
		}

		var circle 		 	= new Kinetic.Circle({
			x: 				x,
	        y: 				this.y,
	        radius: 		radius,
	        fill: 			color,
	        //stroke: 		'#cccccc',
	        strokeWidth: 	0,
	        shadowColor: 	'black',
		    shadowOffset: 	{x: 5,y: 10},
		    shadowOpacity: 	0.2,
		});

		var text 			= new Kinetic.Text({
	        x: 				x,
	        y: 				this.y,
	        offsetX: 		radius,
	        offsetY: 		30,
	        text: 			text,
	        fontSize: 		fontSize,
	        fontFamily: 	'Helvetica',
	        fill: 			'white',
	        strokeWidth: 	0,
	        width: 			radius * 2,
	        padding: 		15,
	        align: 			'left'
		});
		
		//Adding node to handle group, and returning handle.
		handle.add(circle); 
		handle.add(text);
		return handle;
	}

	this.createLabel = function createLabel(author, date, topic, topicFlag) {
		var textName, textDate, topicName, line, x, y, lineLength;
		var handle = new Kinetic.Group();

		y = this.y - 140;
		x = 110;
		if(topicFlag) {lineLength = 700;}
		else {lineLength = 300;}

		textName = new Kinetic.Text({
	        x: 				x,
	        y: 				y,
	        text: 			author,
	        fontSize: 		14,
	        fontFamily: 	'Helvetica',
	        fill: 			'white',
	        strokeWidth: 	0,
	        align: 			'left'
		});

		topicName = new Kinetic.Text({
	        x: 				x + 450,
	        y: 				y,
	        text: 			topic,
	        fontSize: 		20,
	        fontFamily: 	'Futura',
	        fill: 			'#eeeeee',
	        strokeWidth: 	0,
	        align: 			'left'
		});

		textDate = new Kinetic.Text({
	        x: 				x,
	        y: 				y + 24,
	        text: 			date,
	        fontSize: 		11,
	        fontFamily: 	'Helvetica',
	        fill: 			'white',
	        strokeWidth: 	0,
	        align: 			'left'
		});

		line = new Kinetic.Line({
        points: [x, y + 20,x + lineLength, y + 20],
        stroke: '#999999',
        strokeWidth: 2,
        lineCap: 'round'
      });

		handle.add(textName);
		handle.add(textDate);
		if(topicFlag) {handle.add(topicName);}
		handle.add(line);
		return handle;
	}

	this.createFlags = function createFlags (num) {
		//Check if there's any update flags
		if (num == "0") {return null;}

		var numFlags, circle, x, y;
		var handle = new Kinetic.Group();		

		y = this.y - 100;
		x = 400;

		circle 		 	= new Kinetic.Circle({
			x: 				x,
	        y: 				y,
	        radius: 		10,
	        fill: 			"#da3e26",
	        strokeWidth: 	0
		});

		numFlags 			= new Kinetic.Text({
	        x: 				x - 3,
	        y: 				y - 6,
	        text: 			num,
	        fontSize: 		10,
	        fontFamily: 	'Helvetica',
	        fill: 			'white',
	        strokeWidth: 	0
		});

		handle.add(circle);
		handle.add(numFlags);
		return handle;
	}

	//Draw argument
	this.drawArgument = function drawArgument() {
		//Draw question and answer nodes.
		this.questionNode = this.createNode(this.questionText, "question");
		this.answerNode = this.createNode(this.answerText, "answer");
		this.label = this.createLabel(this.name, this.lastModified, this.topic, this.topicFlag);
		this.flags = this.createFlags(this.updateFlags);

		//Initiate branches and nodes.
		for (i = 0; i < argument.branches.length; i++) { //Iterate through branches.
			//var newBranch = argument.branches[i];
			//this.branches.push(new Branch(newBranch.name, newBranch.nodes));
		}

		//Add argument to editor layer.
		this.argumentGroup.add(this.answerNode);
		this.argumentGroup.add(this.questionNode); 
		this.argumentGroup.add(this.label);
		if(!!this.flags) {this.argumentGroup.add(this.flags); this.flags.setZIndex(3);}

		this.answerNode.setZIndex(1);
		this.questionNode.setZIndex(2);
		this.label.setZIndex(2);
		

		return this.argumentGroup;
	}
}

//Branch Class
//_________________________________
function Branch(name, nodes) {
	this.name; //Name of the branch.
	this.nodes; //Array of node objects.
}

//Node Class
//_________________________________
function Node(name, author, description, type) {
	this.name 			= name; //Name.
	this.author 		= author; //Name of the node's author.
	this.description 	= description; //Textual description; displayed in inspector view.
	this.type			= type; //Node type: event, interpret, evidence, dispute, image, link (online article, etc.), or video. 

	this.group 			= new Kinetic.Group(); //Store group of visible assets, i.e. text, circle, evidence and disputes.
	this.text; //Node text. 
	this.circle; //Node circle. 
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

