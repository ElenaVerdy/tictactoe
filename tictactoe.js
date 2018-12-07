"use strict"
var controller = {

	field: [].slice.call(document.getElementsByName("cell")),
	res: document.getElementById("res"),
	copyOfField: [],

	start() {

		res.addEventListener("click", function(event) {
			view.res();
			model.res();
		});


		controller.field.forEach(function(item, i) {
			controller.copyOfField.push(item);
				item.addEventListener("click", function(event){

					twoPlayers.disabled = true;
					onePlayer.disabled = true;

					if(twoPlayers.checked) {
						view.twoPlayersMoved(item);
						model.currentValue++;
					if (model.state()) {
						view.gameOver(model.state());
						return;
						};

					} else {

					controller.currentMove = item;
					controller.generator = controller.onClick();
					controller.generator.next();
					}
				});
			});
		}

	};


controller.onClick = function* (event) {
		view.playersTurn(controller.currentMove);
		model.playerMadeAMove(controller.currentMove);

		if (model.state()) {
			view.gameOver(model.state());
				return;
		};

		view.computersTurn(model.computerMadeAMove());
		yield;

		if (model.state()) {
			view.gameOver(model.state());
				return;
		}
		};

var view = {

	res() {
		onePlayer.disabled = false;
		twoPlayers.disabled = false;
		result.innerHTML = "";
		controller.field.forEach(function(item) {
			item.value = "";
			item.disabled = false;
			});
		},

	playersTurn(item) {
		item.value = "X";
		result.innerHTML = "I'm thinking..";
		controller.field.forEach((item)=>item.disabled = true);
		},

	computersTurn(CoorsOfComputersMove) {
		controller.timerID = setTimeout( function() {
		controller.field[CoorsOfComputersMove].value = "O";
		controller.copyOfField.forEach((item)=>item.disabled = false);
			result.innerHTML = "Your turn!";
			controller.generator.next();
			}, Math.random()*1500+100 );
		},

	gameOver(res) {
		controller.copyOfField.forEach((item) => item.disabled = true);
		if(res === "Even") {
			result.innerHTML = "Even!";
			return;
			} else {
				result.innerHTML = res + " WON!!!"
			}
		},

	twoPlayersMoved(item) {
		if (model.currentValue%2) {
			item.value = "X";
			result.innerHTML = "Turn O";
			} else {
			item.value = "O";
			result.innerHTML = "Turn X";
		};
		item.disabled = true;
		}

	};

var model = {

	currentValue: 1,

	allVars: (function (field) {
		var allVars = [];
		var tryToWinDiagon = [];
			for (var i = 1; i < 4; i++) {
				tryToWinDiagon.push(document.getElementById(""+i+i));
				tryToWinDiagon.push(document.getElementById(""+i+(4-i)));
				if (tryToWinDiagon[5] !== undefined) {
					allVars.push([tryToWinDiagon[0],tryToWinDiagon[2],tryToWinDiagon[4]]);
					allVars.push([tryToWinDiagon[1],tryToWinDiagon[3],tryToWinDiagon[5]]);
					}

				var tryToWin = [];
				for (var j = 1; j < 4; j++) {
				tryToWin.push(document.getElementById(""+i+j));
				tryToWin.push(document.getElementById(""+j+i));
					}
					allVars.push([tryToWin[0],tryToWin[2],tryToWin[4]]);
					allVars.push([tryToWin[1],tryToWin[3],tryToWin[5]]);
				}
		return allVars;
		})(controller.field),

	state() {
		var a = "X";
		if (model.currentValue%2) a = "O";
		return model.checkIfGameIsOver(model.checkAllVars(model.allVars), a)
		},

	res() {
		clearTimeout(controller.timerID);
		model.currentValue = 1;
		controller.copyOfField = [];
		controller.field.forEach(function(item) {
			controller.copyOfField.push(item)
			})
			},

	computerMadeAMove() {
		var a = model.computersChoise();
		model.currentValue +=1;
		controller.copyOfField.splice(controller.copyOfField.indexOf(controller.field[a]),1);
		return a;
		},

	//вернут координаты ечейки, куда должен сходить компьютер.
	computersChoise () {
		if (!controller.field[4].value) return 4;
			if (model.currentValue === 4) {
				if(model.checkForCornerStrategy(model.allVars)) return 1;
				if(model.breakMidSideStrategy(model.allVars)) return model.breakMidSideStrategy(model.allVars);
				}

			if(model.checkIfTwoInOneRow(model.allVars, "O", controller.field) != undefined) {
				return model.checkIfTwoInOneRow(model.allVars, "O", controller.field);
			}
			if(model.checkIfTwoInOneRow(model.allVars, "X", controller.field) != undefined) {
				return model.checkIfTwoInOneRow(model.allVars, "X", controller.field);
			}

			return model.findBetterChoice( 
				model.getLinesAround(controller.copyOfField, model.allVars), 
				controller.field, controller.copyOfField);
		},

	getLinesAround (copyOfField, allVars) {
		var linesAround =[];
		for (var i = 0; i < copyOfField.length; i++) {
			linesAround.push([]);
			for (var j = 0; j < allVars.length; j++) {
				if (allVars[j].indexOf(copyOfField[i]) !== -1) {
					linesAround[i].push([allVars[j][0].value, allVars[j][1].value, allVars[j][2].value])
					}
				}
			}
		return linesAround;
		},

	findBetterChoice (linesAround, field, copyOfField) {
		var cellRankings = [];
		for (var i = 0; i < linesAround.length; i++) {
			cellRankings[i] = 0;

			if (linesAround[i][0].indexOf("X") !== -1 &&
				linesAround[i][1].indexOf("X") !== -1 &&
				linesAround[i][ linesAround[i].length-1 ].indexOf("X") !== -1) {
				cellRankings[i] +=10;
				}

			if (linesAround[i][0].indexOf("O") !== -1 &&
				linesAround[i][1].indexOf("O") !== -1 &&
				linesAround[i][ linesAround[i].length-1 ].indexOf("O") !== -1) {
				cellRankings[i] -=+5;
				}

			for (var j = 0; j < linesAround[i].length; j++) {

				if (linesAround[i][j].indexOf("O") !== -1) { cellRankings[i] +=2}

				if (linesAround[i][j].indexOf("X") !== -1) { cellRankings[i] += 2};

				if (linesAround[i][j].indexOf("X") === -1) { cellRankings[i] += 1};

				if (linesAround[i].length === 3) {cellRankings[i] +=5}

				}
			}

			var rankingsSorted = cellRankings.slice(); 
			rankingsSorted.sort(function(a,b) {
			return b-a;
			});
		return field.indexOf(copyOfField[cellRankings.indexOf(rankingsSorted[0])]);
		},

//возвращает координаты хода компьютера.в массиве field;
	checkIfTwoInOneRow (allVars, val, field) {
		outer: for (var i = 0; i < allVars.length; i++) {
			var nums = 0;
			var epmtyCell = [];
			var varsValues = allVars[i].map(function(item, i, arr) {
				return item.value;
			})

			inner: for (var j = 0; j < varsValues.length; j++) {
				if (varsValues[j] === "") { nums++ }
				}
				if (nums !== 1) {
					continue outer;
					} else {

						epmtyCell[1] = varsValues.indexOf("");
						varsValues.splice(epmtyCell[1],1);
						if (varsValues[0] === varsValues[1] && varsValues[0] === val) {
							epmtyCell[0] = i;
							return controller.field.indexOf(allVars[epmtyCell[0]][[epmtyCell[1]]]);
						}
					}
			}
		},

// Возвращает X O или Even если игра оконцена
	checkIfGameIsOver (gameOver, lastMove) {
		if (gameOver)	{
			return lastMove;
			} else if (this.currentValue === 10) {
				return "Even";
				};
		},

	breakMidSideStrategy (allVars) {
		if (allVars[0][1].value === allVars[1][1].value && allVars[0][1].value !=="" && !allVars[1][0].value) return controller.field.indexOf(allVars[1][0]);
		if (allVars[6][1].value === allVars[7][1].value && allVars[6][1].value !=="" && !allVars[7][2].value) return controller.field.indexOf(allVars[7][2]);
		if (allVars[0][1].value === allVars[7][1].value && allVars[0][1].value !=="" && !allVars[0][2].value) return controller.field.indexOf(allVars[0][2]);
		if (allVars[1][1].value === allVars[6][1].value && allVars[6][1].value !=="" && !allVars[1][2].value) return controller.field.indexOf(allVars[1][2]);
		},

	checkForCornerStrategy (allVars) {
		var diagon1 = "";
		var diagon2 = "";
			diagon1 = allVars[4][0].value+allVars[4][1].value+allVars[4][2].value;
			diagon2 = allVars[5][0].value+allVars[5][1].value+allVars[5][2].value;
			if ( !allVars[0][1].value && (diagon1 === "XOX" || diagon2 === "XOX")) return true;
		},

	playerMadeAMove (item) {
		controller.copyOfField.splice(controller.copyOfField.indexOf(item), 1);
		this.currentValue +=1;
		},

	checkAllVars (allVars) {
		var gameOver = false;
		allVars.forEach(function(item, i) {
		if (item[0].value===item[1].value && item[1].value===item[2].value 
			&& item [0].value !== "") {
			gameOver = true;
			};
			});
		return gameOver;
		}

	};



(controller.start());