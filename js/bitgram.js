// bitbram naming space.
var bitgram = {};

//
// Class: bitgram.Logo
// Since: v1.0 (2012/10/16)
//
// lint at http://www.javascriptlint.com/online_lint.php
// 1 warning: with statement.
//
// containerId: ロゴを表示するHTMLエレメントのID。 （必須)  
// inputId:     ロゴの文字を変更するためのテキストフィールドのID。  
// sign:        文字の初期値。(デフォルト: "BitGram")  
// color:       ロゴのビットが立っているセルの色。(デフォルト: "#666")  
// gridNum:     ロゴのグリッド内のセルの数 (デフォルト: 8)  
// cellSize:    セルのピクセルサイズ　(デフォルト: 20)  
// canvasId:    ロゴのキャンバスに定義したいID (デフォルト: "bitgram_canvas") 
//
bitgram.Logo = function(containerId, inputId, sign, color, gridNum, cellSize, canvasId) {
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
	this.canvasElement    = document.createElement('canvas');
	this.signElement      = document.createElement('div');
	this.hexElement       = document.createElement('div');
	this.inputField       = document.getElementById(inputId);

	this.canvasId         = canvasId || this.defaults.CANVAS_ID;
	this.sign             = sign     || this.defaults.SIGN;
	this.gridNum          = gridNum  || this.defaults.GRID_NUM;
	this.cellSize         = cellSize || this.defaults.CELL_SIZE;

	this.color            = color || this.defaults.COLOR_TRUE;
	this.colorMode        = 0;		// 0: #3333, 1: single random, 2: multi random

	this.grid             = new bitgram.Grid(this.gridNum);

	// initialize
	this.init();
};

//
// bitgram.Logo.prototype
//
// init: 			初期化。
// setSign: 		文字（サイン)を設定し、canvasと文字を書き換える。
// draw: 			canvas, 文字、16進数の文字を書き換える。
// changeColorMode: カラーモード(0 - default, 1 - random, 2 - multi random) を切り替える
// getSignAsHex: 	文字列(this.sign)を16進数に変換する。
// getSignAsBin: 	文字列(this.sign)を2進数に変換する。
// updateCells: 	文字列(this.sign)に基づいてgridのデータを更新する。
// getRandomColor: 	this.defaults.COLORSから任意の１つを取り出す。
//
//
bitgram.Logo.prototype =  {
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
// Class: bitgram.RSSFeed
// Since:       v1.1
// Require:     jQuery 1.8
//
// lint at http://www.javascriptlint.com/online_lint.php
// 0 error.
//
// containerId: target container Element ID. (require)
// maxFeeds:    max feed number. (default:10)
// maxChars:    max content character number. (default:200)
//
bitgram.RSSFeed = function(containerId, maxFeeds, maxChars) {
	this.defaults = {
		MAXFEEDS: 	10,
		MAXCHARS: 	200,
		CLASS_FEED_CONTAINER: "bitgram_feed_container",
		CLASS_FEED_TITLE:     "bitgram_feed_title",
		CLASS_ITEM_CONTAINER: "bitgram_item_container",
		CLASS_ITEM_TITLE:     "bitgram_item_title",
		CLASS_ITEM_DATE:      "bitgram_item_date",
		CLASS_ITEM_DESC:      "bitgram_item_description",
		LOADING_ICON:         "http://www.bitgram.net/img/loadinfo.net.gif"

	};

	this.containerElement = $("#" + containerId).addClass(this.defaults.CLASS_FEED_CONTAINER);

	this.maxFeeds = maxFeeds || this.defaults.MAXFEEDS;
	this.maxChars = maxChars || this.defaults.MAXCHARS;
	this.feeds = [];

};


//
// bitgram.RSSFeed.prototype
//
// getFeeds:　RSSを読み込み、コンストラクターのcontainerIdで得られたエレメントに追加する。
//
bitgram.RSSFeed.prototype = {
	getLoadingImage: function() {
		var loadingImage = $("<div>").css({"text-align":"center", "margin-top":"2.5em"});
		loadingImage.append($("<img>").attr("src", this.defaults.LOADING_ICON));
		return loadingImage;
	},
	//
	getFeeds: function(RSSURL, maxFeeds, contentChars) {
		var loadingImage = this.getLoadingImage();
		this.containerElement.before(loadingImage);

		this.containerElement.hide();
		jQuery.ajax({
			context: this,
			url: RSSURL,
			type: 'get',
			dataType: 'xml',
			async: true,

			success: function(xml, status, xhr) {
				var items = this.feeds;
				var containerElement = this.containerElement;
				var defaults = this.defaults;
				var _maxFeeds = maxFeeds || this.maxFeeds;
				var _contentChars = contentChars || this.maxChars;

				var feedTitle = $(xml).find('channel title:first').text();
				// var feedLink = $(xml).find('channel link:first').text(); ... Safari doesn't work.
				var feedLink = $(xml).find('channel link:contains("http"):first').text();
				console.log(feedLink);

				feedTitleElement = $("<a>").addClass(defaults.CLASS_FEED_TITLE);
				feedTitleElement.attr("href", feedLink).text(feedTitle);
				containerElement.append(feedTitleElement);

				var counter = 0;
				$(xml).find('item').each( function() {
					var title = $(this).find("title").text();
					var titleLink = $(this).find("link").text();
					var date = bitgram.dateFormat(new Date($(this).find("pubDate").text()));
					var description = $(this).find("description").text();
					if (_contentChars > 0) {
						description = description.substring(0, _contentChars - 3 ) + "...";
					}

					var item = $("<div>").addClass(defaults.CLASS_ITEM_CONTAINER);
					$("<a>").addClass(defaults.CLASS_ITEM_TITLE).attr("href", titleLink ).text(title).appendTo(item);
					$("<div>").addClass(defaults.CLASS_ITEM_DATE).text(date).appendTo(item);
					$("<div>").addClass(defaults.CLASS_ITEM_DESC).html(description).appendTo(item);
					containerElement.append(item);
					counter++;

					if (counter >= _maxFeeds) {
						loadingImage.hide();
						containerElement.fadeIn();
						return false;
					}
				});
			}
		});
		return this.feeds;
	}
};



//
// Utility Class
//

//
// Class: Cell
//
bitgram.Cell = function(x, y, bit) {
	this.x = x;
	this.y = y;
	this.bit = bit;
}


//
// Class: Grid
//
bitgram.Grid = function(gridNum) {
	this.gridNum = gridNum;
	this.cells = [];
	this.resetCells(gridNum);
}

//
// Grid.prototype
//
bitgram.Grid.prototype = {
	resetCells: function() {
		this.cells = [];
		var x, y;
		for (y = 0; y < this.gridNum; y++) {
			for(x = 0; x < this.gridNum; x++) {
				this.cells.push(new bitgram.Cell(x, y, false));
			}
		}
	}
};


//
// Utility function
//

bitgram.dateFormat = function(date) {
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var date = date.getDate();

	return year + "/" + ("0" + month).slice(-2) + "/" + ("0" + date).slice(-2);
}

bitgram.sprite = function(element, pos1, pos2, interval) {
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

