//
// lint at http://www.javascriptlint.com/online_lint.php
// 1 warning:
//
function BitGram(containerId, sign, inputId, gridNum, cellSize) {

	var defaults = {
		SIGN:				"BitGram",
		MAX_SIGN_NUM:		8,
		COLORS:				["red", "orange", "yellow", "green", "blue", "indigo", "violet"],
		COLOR_TRUE:			"#666",
		COLOR_FALSE:		"#FFF",
		GRID_NUM:			8,
		CELL_SIZE:			20,
		CLASS_SIGN:			"bitgram_sign",
		CLASS_HEX:			"bitgram_hex"
	};

	this.containerElement = document.getElementById(containerId);
	this.canvasElement = document.createElement('canvas');
	this.signElement = document.createElement('div');
	this.hexElement = document.createElement('div');
	this.inputField = document.getElementById(inputId);

	this.sign      = sign     || defaults.SIGN;
	this.gridNum   = gridNum  || defaults.GRID_NUM;
	this.cellSize  = cellSize || defaults.CELL_SIZE;
	this.grid      = new Grid(this.gridNum);

	this.color     = defaults.COLOR_TRUE;
	this.colorMode = 0;		// 0: #3333, 1: single random, 2: multi random


	BitGram.prototype.init = function() {
		var _origin = this;
		with (this) {
			if (!containerElement) {
				return;
			}
			signElement.setAttribute('class', defaults.CLASS_SIGN);
			hexElement.setAttribute('class', defaults.CLASS_HEX);

			var node = containerElement.firstChild;
			containerElement.insertBefore( canvasElement, node );
			containerElement.insertBefore( signElement, node );
			containerElement.insertBefore( hexElement, node );

			canvasElement._origin = _origin;
			canvasElement.onclick = function() {
				this._origin.changeColorMode();
			};

			if (inputField) {
				inputField._origin = _origin;
				inputField.onkeyup = function() {
					this._origin.setSign(this.value);
				};
				inputField.onclick = function() {
					this._origin.setSign("");
					this.value = "";
				};
			}

			updateCells();
			draw();
		}
	};

	BitGram.prototype.setSign = function(sign) {
		if (defaults.MAX_SIGN_NUM < sign.length) {
			return;
		}

		if (!sign) {
			this.sign = defaults.SIGN;
		} else {
			this.grid.resetCells();
			this.sign = sign;
		}

		this.updateCells();
		this.draw();
	};

	BitGram.prototype.draw = function() {
		if (!this.canvasElement.getContext) {
			return false;
		}

		// draw grid.
		var context = this.canvasElement.getContext('2d');
		this.canvasElement.width = this.canvasElement.height = this.gridNum * this.cellSize + 1;

		var i;
		for (i in this.grid.cells) {
			var cell = this.grid.cells[i];

			if (cell.bit) {
				if (this.colorMode == 2) {
					context.fillStyle = this.getRandomColor();

				} else {
					context.fillStyle = this.color;
				}
			}	else {
				context.fillStyle = defaults.COLOR_FALSE;
			}
			var x = cell.x * this.cellSize + 0.5;
			var y = cell.y * this.cellSize + 0.5;
			context.fillRect(x, y, this.cellSize, this.cellSize);
			context.strokeRect(x, y, this.cellSize, this.cellSize);
		}
		
		// update sign.
		if (this.signElement) {
			this.signElement.textContent = this.sign;
		}

		// update hex.
		if (this.hexElement) {
			this.hexElement.textContent = this.getSignAsHex();
		}
		return true;
	};

	BitGram.prototype.changeColorMode = function() {
		this.colorMode++;
		switch (this.colorMode) {
			case 0:  	this.color = defaults.COLOR_TRUE;
						break;
			case 1: 	this.color = this.getRandomColor();
						break;
			case 2: 	break;
			default: 	this.colorMode = 0;
						this.color = defaults.COLOR_TRUE;
						break;
		}
		this.draw();
		return this.colorMode;
	};


	BitGram.prototype.getSignAsHex = function() {
		var code = "";
		var i;
		for (i = 0; i < defaults.MAX_SIGN_NUM; i++) {
			var ascii = this.sign.charCodeAt(i).toString(16).toUpperCase();
			if (!ascii.match(/^[0-9ABCDEF][0-9ABCDEF]$/)) {
				continue;
			}
			code += ascii;
		}
		return code;
	};

	BitGram.prototype.getSignAsBin = function() {
		var code = "";

		var i;
		for (i = 0; i < defaults.MAX_SIGN_NUM; i++) {
			var ascii = this.sign.charCodeAt(i).toString(2);

			if (isNaN(ascii)) {
				ascii = "00000000";
			}

			if (ascii.length != 8) {
				var p;
				for (p = 0; p <= 8 - ascii.length; p++ ) {
					ascii = "0" + ascii;
				}
			}
			code += ascii;
		}
		return code;
	};

	BitGram.prototype.updateCells = function() {
		var bin = this.getSignAsBin();
		var i;
		for (i in this.grid.cells) {
			if (1 == bin.charAt(i)) {
				this.grid.cells[i].bit = true;
			}
		}
	};

	BitGram.prototype.getRandomColor = function() {
		var r = Math.floor(Math.random() * defaults.COLORS.length);
		return defaults.COLORS[r];
	};

	// initialize
	this.init();
}


function Cell(x, y, bit) {
	this.x = x;
	this.y = y;
	this.bit = bit;
}

function Grid(gridNum) {
	this.cells = [];

	Grid.prototype.resetCells = function() {
		this.cells = [];
		var x, y;
		for (y = 0; y < gridNum; y++) {
			for(x = 0; x < gridNum; x++) {
				this.cells.push(new Cell(x, y, false));
			}
		}
	};

	this.resetCells();
}

function sprite(element, pos1, pos2, interval) {
	var flg = 0;
	var timerId = setInterval( function() { 
		if (flg === 0) {
			element.css({
				"background-position" : pos1
			});
			flg = 1;
		} else {
			element.css({
				"background-position" : pos2
			});
			flg = 0;
		}
	}, interval);
}

