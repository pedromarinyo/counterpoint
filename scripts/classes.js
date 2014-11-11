//Editor Class
//_________________________________
function Editor() {
	this.bg; //editor_layer background.
	this.bgImg; //editor_layer background image.
	this.arguments = new Array(); //Array of loaded arguments. 
	this.toolbox; //Toolbox group.
	this.toolboxIsOpen = false;
	this.currTopic = "msw";

	this.currArgument;
	this.currArgumentGroup = new Kinetic.Group();
	this.argumentGroup = new Kinetic.Group(); //Group of argument visual assets.
	
	this.add; //Toolbox icons.
	this.interpretEvent;
	this.recordEvent;
	this.backButton;
	
	this.openToolbox; //Tweens.
	this.rotateAdd;
	this.openBackButton;

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
			offsetX: 			40,
			offsetY: 			40,
 			image:  			images["add"],
 			width: 				80,
 			height: 			80
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

    	//Loading arguments for testing.
		this.loadArguments(argumentsFromDatabase);
		for (i = 0; i < this.arguments.length; i++) {
			this.argumentGroup.add(this.arguments[i].drawArgumentSmall());	
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
        this.toolbox.moveToTop();
        this.add.moveToTop();
        this.openToolbox.play();
        this.rotateAdd.play();
        this.toolboxIsOpen = true;
        return true;
    }

    this.hideToolbox = function hideToolbox() {
    	this.openToolbox.reverse(); 
    	this.rotateAdd.reverse();
    	this.add.moveToTop();
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

    	for (i = 0; i < this.arguments.length; i++) {
    		this.arguments[i].loadBranches();
    	}
    }

    this.expandArgument = function expandArgument(argument) { 
    	this.fade(this.argumentGroup, "out");//Fade out collapsed argument list.
    	this.fade(this.bgImg, "out"); //Fade out background image.
    	//this.argumentGroup.hide();

    	this.currArgument = argument;
    	this.currArgumentGroup = argument.drawArgumentLarge();
    	var bg = new Kinetic.Rect({
    		x: 				0 - sw,
    		y: 				0 - sh,
    		width: 			sw * 3,
    		height: 		sh * 3
    	});
    	this.currArgumentGroup.add(bg);
    	bg.moveToBottom();

    	editor_layer.add(this.currArgumentGroup);
    	//this.currArgumentGroup.setZIndex(1);

    	this.currArgumentGroup.setAttrs({
    		draggable: 		true
    	});

    	this.showToolbox();
    	
    	return true;
    }

    this.showArgList = function showArgList() {
    	this.currArgument.reset();
    	this.currArgumentGroup.destroyChildren();
    	
    	this.argumentGroup.show();
    	this.fade(this.argumentGroup, "in");//Fade in collapsed argument list.
    	this.fade(this.bgImg, "in"); //Fade in background image.

    	this.hideToolbox();
    	stage.draw();
    }

    this.fade = function fade(node, direction) {
    	var opacity;
    	if(direction == "out") {opacity = 0;}
    	else {opacity = 1;}

    	var fade = new Kinetic.Tween({
    		node: 		node,
    		opacity: 	opacity,
    		duration: 	0.3
    	});

    	fade.play();
    }   
}

//Argument Class
//_________________________________
function Argument(argument, y, topicFlag) {
	this.name 			= argument.name; //Name of the argument.
	this.author 		= argument.author; //Name of the argument's author.
	this.lastModified 	= argument.lastModified;
	this.updateFlags	= argument.updateFlags;
	this.branchesArg 	= argument.branches;
	this.branches 		= new Array();
	this.topic 			= argument.topic; //Topic of the argument, i.e. "How to Get Away with Murder", etc.
	this.topicHandle 	= argument.topicHandle;
	this.questionText 	= argument.question; //Author's proposed question.
	this.answerText 	= argument.answer; //Author's proposed solution.	
	this.y 				= y; //Arguments y coordinate.
	this.topicFlag 		= topicFlag;
	this.currX 	 		= 250; //Starting horizontal position; used for drawing nodes on expanded argument.

	this.handle 		= new Kinetic.Group(); //Stores all visual assets, i.e. question and answer nodes, branches.
	this.handleExp 		= new Kinetic.Group(); //Store all visual assets of expanded argument.
	this.questionNode 	= new Kinetic.Group();
	this.answerNode 	= new Kinetic.Group();
	this.qNodeExp 		= new Kinetic.Group();
	this.aNodeExp 		= new Kinetic.Group();
	this.label 			= new Kinetic.Group();
	this.flags 			= new Kinetic.Group();
	this.track 			= new Kinetic.Group();
	
	this.branches; //Array of branch objects. 
	this.stepY; //Amount to increment y when drawing branches.

	//Load branches
	this.loadBranches = function loadBranches() {
		this.branches = [];
		for (i = 0; i < this.branchesArg.length; i++) {
			this.branches.push(new Branch(this.branchesArg[i], this.topicHandle));
		}
	}

	//Reset argument
	 this.reset = function reset() {
	 	this.currX = 250;
    }
	
	//Create question and answer nodes
	this.createNode = function createNode(text, type) {
		var radius, handle, x, fontSize, color, colorLibrary, colorPallet, isDraggable, dragBounds;
		handle = new Kinetic.Group();
		dragBounds = null;

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
				x = this.currX; 
				fontSize = 12;
				color = colorPallet[0]; 
				break;
			case "questionExp":
				radius = 100; 
				x = this.currX; 
				fontSize = 12; 
				color = colorPallet[1];
				break;
			case "answer":
				radius = 80; 
				x = 350; 
				fontSize = 12; 
				color = colorPallet[1];
				isDraggable = true;
				dragBounds = function(pos) {
					if (pos.x < 0) {return {x: this.getAbsolutePosition().x, y: this.getAbsolutePosition().y};}
					else if (pos.x > 100) {return {x: this.getAbsolutePosition().x, y: this.getAbsolutePosition().y};}
					else {return {x: pos.x, y: this.getAbsolutePosition().y};}
				}
				break;
			case "answerExp":
				radius = 100; 
				x = this.currX; 
				fontSize = 12; 
				color = colorPallet[1];
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
		    shadowOpacity: 	0.2		    
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

		handle.setAttrs({
			draggable: 		isDraggable,
			dragBoundFunc: 	dragBounds
		});

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

		circle 		 		= new Kinetic.Circle({
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

	this.createTrack = function createTrack() {
		var track, handle;
		handle = new Kinetic.Group();

		track 		 	= new Kinetic.Rect({
			x: 				300,
	        y: 				this.y,
	        offsetY: 		7,
	        width: 			200,
	        height: 		15,
	        cornerRadius: 	7,
	        fill: 	 		'#aaa',
	        strokeWidth: 	0,
	        opacity: 		0.2
		});

		handle.add(track);
		return handle;
	}

	//Draw collapsed argument
	this.drawArgumentSmall = function drawArgument() {
		//Draw question and answer nodes.
		this.questionNode = this.createNode(this.questionText, "question");
		this.answerNode = this.createNode(this.answerText, "answer");
		this.label = this.createLabel(this.name, this.lastModified, this.topic, this.topicFlag);
		this.flags = this.createFlags(this.updateFlags);
		this.track = this.createTrack();

		//Add argument to editor layer.
		this.handle.add(this.answerNode);
		this.handle.add(this.questionNode); 
		this.handle.add(this.label);
		this.handle.add(this.track);
		if(!!this.flags) {this.handle.add(this.flags); this.flags.setZIndex(3);}

		this.answerNode.setZIndex(1);
		this.questionNode.setZIndex(2);
		this.label.setZIndex(2);
		this.track.setZIndex(0);
		
		return this.handle;
	}

	//Draw expanded argument
	this.drawArgumentLarge = function drawArgumentLarge(){ //ERROR IN BRANCHES
		
		//Initiate branches and nodes.
		this.stepY = sh / (this.branches.length + 1);
		this.y = this.stepY;
		var largestBranchLength = this.branches[0].nodesArg.length;
		for (var i = 0; i < this.branches.length; i++) { //Iterate through branches.			
			
			this.branches[i].loadNodes();
			var branch = this.branches[i].draw(this.stepY);
			this.handleExp.add(branch);

			//Check if this is largest branch.
			if(i != 0) {
				if(this.branches[i].nodesArg.length > largestBranchLength) {largestBranchLength = this.branches[i].nodesArg.length;}
			}
		}

		

		//Draw question and answer nodes.
		this.qNodeExp = this.createNode(this.questionText, "questionExp");
		//Adjusting this.currX; moving answer node to end of branches. 
		this.currX = 270 + 60 + (140 * (largestBranchLength + 1));
		this.aNodeExp = this.createNode(this.answerText, "answerExp");
		
		this.handleExp.add(this.qNodeExp);
		this.handleExp.add(this.aNodeExp);

		return this.handleExp;
	}

	//Return node to origin
	this.returnAnswerNode = function returnAnswerNode(node){
		var moveNode = new Kinetic.Tween({
			node: 			node,
			x: 				0,
			duration: 		0.2,
			easing: 		Kinetic.Easings["EaseOut"]
		});

		moveNode.play();
	}
}

//Branch Class
//_________________________________
function Branch(branch, palletName) {
	this.name 		= branch.name; //Name of the branch.
	this.nodesArg 	= branch.nodes; //Array of node objects.
	this.palletName = palletName;
	this.nodes 		= new Array();

	this.handle 	= new Kinetic.Group(); //Handle for moving branch's visual assets.
	this.stepX 		= 140;
	this.originX 	= (270) + 20; //Padding = 20px.
	this.line; 
	this.y;
	

	this.loadNodes = function loadNodes() {
		this.nodes = [];
		for (var i = 0; i < this.nodesArg.length; i++) {
			this.nodes.push(new Node(this.nodesArg[i]));
		}
	}

	this.draw = function draw(y) {
		var x = 280 + (this.stepX * (this.nodes.length + 1)); 
		this.y = y;

		//Drawing branch line.
		this.line = new Kinetic.Line({
			points: 		[250, y, x, y],
	        stroke: 		'#ccc',
	        strokeWidth: 	4,
	        lineCap: 		'round'
		});
		this.handle.add(this.line);
		
		//Drawing nodes.
		for (i = 0; i < this.nodes.length; i++) {
			var node = this.nodes[i].draw(this.y, this.originX + (this.stepX * (i+1)), this.palletName); 
			this.handle.add(node);
		}

		return this.handle;
	}
}

//Node Class
//_________________________________
function Node(node) {
	this.name 			= node.name; //Name.
	this.author 		= node.author; //Name of the node's author.
	this.description 	= node.description; //Textual description; displayed in inspector view.
	this.type			= node.type; //Node type: event, interpret, evidence, dispute, image, link (online article, etc.), or video. 
	this.evidence 		= node.evidence; //Array of evidence nodes. 
	this.dispute 		= node.dispute; //Array of dispute nodes. 

	this.handle 		= new Kinetic.Group(); //Store group of visible assets, i.e. text, circle, evidence and disputes.
	this.color; 
	this.circle; //Node circle. 

	this.draw = function draw(y, x, palletName) {
		var colorLibrary, colorPallet;

		colorLibrary = {
			"msw": ["#cc9933", "#b18e47"],
			"got": ["#115c81", "#425d77"],
			"vods": ["#815d24", "#725b35"]
		};

		
		colorPallet = colorLibrary[palletName];


		var circle 		 	= new Kinetic.Circle({
			x: 				x,
	        y: 				y,
	        radius: 		60,
	        fill: 			colorPallet[1],
	        stroke: 		'#cccccc',
	        strokeWidth: 	2
		});

		var text 			= new Kinetic.Text({
	        x: 				x,
	        y: 				y,
	        offsetX: 		30,
	        offsetY: 		30,
	        text: 			this.name,
	        fontSize: 		12,
	        fontFamily: 	'Helvetica',
	        fill: 			'white',
	        strokeWidth: 	0,
	        width: 			60 * 2,
	        padding: 		5,
	        align: 			'left'
		});
		
		//Adding node to handle group, and returning handle.
		this.handle.add(circle); 
		this.handle.add(text);

		return this.handle;
	}
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

