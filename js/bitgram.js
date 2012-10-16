//
// Class: BirGram
// lint at http://www.javascriptlint.com/online_lint.php
// 1 warning:
//
function BitGram(containerId, canvasId, sign, color, inputId, gridNum, cellSize) {

	this.defaults = {
		SIGN:				"BitGram",
		MAX_SIGN_NUM:		8,
		COLORS:				["red", "orange", "yellow", "green", "blue", "indigo", "violet"],
		COLOR_TRUE:			"#666",
		COLOR_FALSE:		"#FFF",
		GRID_NUM:			8,
		CELL_SIZE:			20,
		CLASS_SIGN:			"bitgram_sign",
		CLASS_HEX:			"bitgram_hex",
		CANVAS_ID: 			"bitgram_canvas" 
	};

	this.containerElement = document.getElementById(containerId);
	this.canvasElement = document.createElement('canvas');
	this.signElement = document.createElement('div');
	this.hexElement = document.createElement('div');
	this.inputField = document.getElementById(inputId);

	this.canvasId  = canvasId || this.defaults.CANVAS_ID;
	this.sign      = sign     || this.defaults.SIGN;
	this.gridNum   = gridNum  || this.defaults.GRID_NUM;
	this.cellSize  = cellSize || this.defaults.CELL_SIZE;

	this.color     = color || this.defaults.COLOR_TRUE;
	this.colorMode = 0;		// 0: #3333, 1: single random, 2: multi random

	this.grid      = new Grid(this.gridNum);

	// initialize
	this.init();
}

//
// BitGram.prototype
//
// init: 			初期化。
// setSign: 		文字（サイン)を設定し、canvasと文字を書き換書き換える。
// draw: 			canvas, 文字、16進数の文字を書き換える。
// changeColorMode: カラーモード(0 - default, 1 - random, 2 - multi random) を切り替える
// getSignAsHex: 	文字列(this.sign)を16進数に変換する。
// getSignAsBin: 	文字列(this.sign)を2進数に変換する。
// updateCells: 	文字列(this.sign)に基づいてgridのデータを更新する。
// getRandomColor: 	this.defaults.COLORSから任意の１つを取り出す。
//

BitGram.prototype = {

	// initiallize
	init: function() {
		var _origin = this;
		with (this) {
			if (!containerElement) {
				return;
			}
			canvasElement.setAttribute('id', canvasId);

			signElement.setAttribute('class', defaults.CLASS_SIGN);
			hexElement.setAttribute('class', defaults.CLASS_HEX);

			var node = containerElement.firstChild;
			containerElement.insertBefore( canvasElement, node );
			containerElement.insertBefore( signElement, node );
			containerElement.insertBefore( hexElement, node );

			canvasElement._origin = _origin;
			canvasElement.onclick = function() {
				_origin.changeColorMode();
			};

			if (inputField) {
				inputField.style.imeMode = "disabled"; // IE, FF only
				inputField.value = "";
				inputField._origin = _origin;
				inputField.onkeyup = function(event) {
					if (event.keyCode == 13) {
						this._origin.changeColorMode();
					}
					this.value = this._origin.setSign(this.value);					
				};
				inputField.onclick = function() {
					this.value = this._origin.setSign("");
				};
			}

			this.updateCells();
			this.draw();
		}
	},

	setSign: function(sign) {
		if (!sign) {
			this.sign = this.defaults.SIGN;
			this.grid.resetCells();
			this.updateCells();
			this.draw();
			return "";
		} else if (this.defaults.MAX_SIGN_NUM < sign.length) {
			this.sign = sign.substring(0, this.defaults.MAX_SIGN_NUM);
			return this.sign;
		} 

		this.sign = sign;

		this.grid.resetCells();
		this.updateCells();
		this.draw();

		return this.sign;
	},

	draw: function() {
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
				context.fillStyle = this.defaults.COLOR_FALSE;
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
	},

	changeColorMode: function() {
		this.colorMode++;
		switch (this.colorMode) {
			case 0:  	this.color = this.defaults.COLOR_TRUE;
						break;
			case 1: 	this.color = this.getRandomColor();
						break;
			case 2: 	break;
			default: 	this.colorMode = 0;
						this.color = this.defaults.COLOR_TRUE;
						break;
		}
		this.draw();
		return this.colorMode;
	},

	getSignAsHex: function() {
		var code = "";
		var i;
		for (i = 0; i < this.defaults.MAX_SIGN_NUM; i++) {
			var ascii = this.sign.charCodeAt(i).toString(16).toUpperCase();
			if (!ascii.match(/^[0-9ABCDEF][0-9ABCDEF]$/)) {
				continue;
			}
			code += ascii;
		}
		return code;
	},


	getSignAsBin: function() {
		var code = "";

		var i;
		for (i = 0; i < this.defaults.MAX_SIGN_NUM; i++) {
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
	},

	updateCells: function() {
		var bin = this.getSignAsBin();
		var i;
		for (i in this.grid.cells) {
			if (1 == bin.charAt(i)) {
				this.grid.cells[i].bit = true;
			}
		}
	}, 

	getRandomColor: function() {
		var r = Math.floor(Math.random() * this.defaults.COLORS.length);
		return this.defaults.COLORS[r];
	}
};


//
// Class: Cell
//
function Cell(x, y, bit) {
	this.x = x;
	this.y = y;
	this.bit = bit;
}


//
// Class: Grid
//
function Grid(gridNum) {
	this.gridNum = gridNum;
	this.cells = [];
	this.resetCells(gridNum);
}

//
// Grid.prototype
//
Grid.prototype = {
	resetCells: function() {
		this.cells = [];
		var x, y;
		for (y = 0; y < this.gridNum; y++) {
			for(x = 0; x < this.gridNum; x++) {
				this.cells.push(new Cell(x, y, false));
			}
		}
	}
};



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

