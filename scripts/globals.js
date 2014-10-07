//Global Variables
//_________________________________
var stage;
var stage_state = "root";

var sw = 1280; //Screen width
var sh = 720; //Screen height

//Global Functions
//__________________________________
function init() {
	//Creating:

	//Stage
	stage = new Kinetic.Stage({
		container: "stage",
		width: sw,
		height: sh
	});  
}