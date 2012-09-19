//
// lint at http://www.javascriptlint.com/online_lint.php
//
function BitGram(containerId, sign, gridNum, cellSize) {
	this.containerElement = document.getElementById(containerId);
	this.canvasElement = document.createElement('canvas');
	this.signElement = document.createElement('div');
	this.hexElement = document.createElement('div');

	var MAX_SIGN_NUM = 8;
	var COLORS_RANDOMLY = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];
	var COLOR_TRUE = "#666";
	var COLOR_FALSE = "#FFF";
	var DEFAULT_GRID_NUM = 8;
	var DEFAULT_CELL_SIZE = 20;
	var DEFAULT_SIGN = "BitGram";
	var DEFAULT_ALT_IMAGE_URL = "http://www.bitgram.net/img/logos/logo-block-160x160.png";
	var DEFAULT_CLASS_SIGN = "bitgram_sign";
	var DEFAULT_CLASS_HEX = "bitgram_hex";

	this.sign      = sign     || DEFAULT_SIGN;
	this.gridNum   = gridNum  || DEFAULT_GRID_NUM;
	this.cellSize  = cellSize || DEFAULT_CELL_SIZE;
	this.grid      = new Grid(this.gridNum);
	this.colorMode = 0;		// 0: #3333, 1: single random, 2: multi random

	BitGram.prototype.init = function() {
		var _origin = this;
		with (this) {
			if (!containerElement) {
				return;
			}
			signElement.setAttribute('class', DEFAULT_CLASS_SIGN);		
			hexElement.setAttribute('class', DEFAULT_CLASS_HEX);

			containerElement.appendChild(canvasElement);
			containerElement.appendChild(signElement);
			containerElement.appendChild(hexElement);	

			canvasElement._origin = _origin;
			this.canvasElement.onclick = function() {
				this._origin.changeColorMode();
			};

			updateCells();
			draw();
		}
	};

	BitGram.prototype.setSign = function(sign) {
		this.grid.resetCells();
		if (!sign) {
			this.sign = DEFAULT_SIGN;
		} else {
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

		var color = COLOR_TRUE;
		if (this.colorMode == 1) {
			color = this.getRandomColor();
		}

		var i;
		for (i in this.grid.cells) {
			var cell = this.grid.cells[i];


			if (cell.bit) {
				if (this.colorMode == 2) {
					color = this.getRandomColor();
				}
				context.fillStyle = color;
			}	else {
				context.fillStyle = COLOR_FALSE;
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
		if (this.colorMode > 2) {
			this.colorMode = 0;
		}
		this.draw();
		return this.colorMode;
	};


	BitGram.prototype.getSignAsHex = function() {
		var code = "";
		var i;
		for (i = 0; i < MAX_SIGN_NUM; i++) {
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
		for (i = 0; i < MAX_SIGN_NUM; i++) {
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
		var r = Math.floor(Math.random() * COLORS_RANDOMLY.length);
		return COLORS_RANDOMLY[r];
	};

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

