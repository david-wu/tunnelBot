







// Initial board, then
// Ordered instructions

const instructions = {
	createUnit: {
		id: '',
		pos: {},
		type: '',
	},
	updateUnit: {
		id: '',
	},
	removeUnit: {

	},
}

const instructionActions = {
	createUnit: function(unitData, board){
		const unit = Unit(unitData);
		board.addUnit(unit);
	},
	updateUnit: function(unitData){

	}
}

function Unit(scope={}){
	return _.defaults(scope, {

		create: function(board){

		}

	})
}

function Board(scope={}){
	_.defaults(scope, {

		dimensions: {
			x: 10,
			y: 10,
		},

		// indices
		units: {},
		map: [],

		init: function(){
			scope.map = scope.createMap();

		},

		createMap: function(){
			return _.times(scope.dimensions.y, function(){
				return _.times(scope.dimensions.x, _.noop);
			});
		}

		addUnit: function(unit){

		}

	})
	scope.init();
	return scope;
}



function Game(scope={}){
	_.defaults(scope, {
		board: [],

		init: function(){
			scope.board = Board();

		},

		applyInstructionSet: function(instructionSet){

		},
	})

	scope.init();
	return scope;
}

function InstructionSet(scope={}){
	return _.defaults(scope, {

	})
}

function Instruction(scope={}){
	return _.defaults(scope, {

	})
}
