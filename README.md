# BitGramロゴの作り方
## How to make JavaScript BitGram Logo.

Author: Yuki Yamazaki (yamazaki@bitgram.net)

###概要
JavaScriptを使って[BitGram](http://www.bitgram.net)のロゴを表示するための方法を紹介します。

#### JavaScript source code
OnLine: <http://www.bitgram.net/js/bitgram.js>  
GitHub: <https://github.com/bitgram/bitgram_js>  

### tested browser
*  Safari 6 (Mac)
*  Firefox 16 (Mac)
*  Chrome 22 (Mac)
*  Opera 12 (Mac)
*  RockMelt 0.16.91 (Mac)
*  Sleipnir 3.8 (Mac)
*  iPhone / iPad

###Quickstart (from GitHub)
githubから、bitgram_jsをクローン（またはダウンロード）します。bitgram_js/ディレクトリに含まれいているファイルはbitgram_js.htmlとjs/bitgram.jsの２つです。

	$ git clone https://github.com/bitgram/bitgram_js
	
	$ ls
	  bitgram_js/ ...
	
	$ ls bitgram_js/
	  bitgram_js.html    js/
	
	$ ls bitgram_js/js
	  bitgram.js
	
bitgram_js.htmlをブラウザーで開くと、以下のようにロゴが表示されます。

![bg01](http://www.bitgram.net/articles/img/bg01.png)

ロゴの部分をクリックすると・・・・

0. gray
1. random mono color
2. random color

という順で色が変わります。

![bg01](http://www.bitgram.net/articles/img/bg02.png)
![bg01](http://www.bitgram.net/articles/img/bg03.png)

また、テキストフィールドにアルファベットを入力すると、"BitGram"という文字から、別の文字に変更することができます。（8文字以内）

![bg01](http://www.bitgram.net/articles/img/bg04.png)

###Quickstart (on your HTML)

bitgram.jsは、<http://www.bitgram.net/js/bitgram.js>に配備していますので読み込みます。

HTMLファイル内に、id属性を指定したDIVエレメントを作り、そのidをbitgram.js内に定義されているbitgram.Logo()というコンストラクターに渡てインスタンス化すれば、指定されたDIVエレメント内にロゴや"4269744772616D"という文字が表示されるはずです。

サンプルHTML

	<!DOCTYPE html>
	<html>
	  <head>
	    <script type="text/javascript" src="http://www.bitgram.net/js/bitgram.js"></script>
	    <script type="text/javascript">
	       window.onload = function() {
	         new bitgram.Logo("logo");
	       };
	    </script>
	  </head>
	  <body>
	     <div id="logo"></div>
	  </body>
	</html>

![bg01](http://www.bitgram.net/articles/img/bg05.png)

###input fieldの取り付け
デフォルトでは"BitGram"という文字が表示されますが、任意の文字列を受け付けるようにすることもできます。

DIVエレメント内に、idを指定したINPUTエレメントを作成し、コンストラクターの2番目の引数にそのidを指定します。

	<!DOCTYPE html>
	<html>
	  <head>
	    <script type="text/javascript" src="http://www.bitgram.net/js/bitgram.js"></script>
	    <script type="text/javascript">
	       window.onload = function() {
	         new bitgram.Logo("logo", "input");
	       };
	    </script>
	  </head>
	  <body>
	     <div id="logo">
	       <input id="input">
	     </div>
	  </body>
	</html>

入力フィールドにアルファベットを入力すると、ロゴや16進数の文字が変わります。

![bg01](http://www.bitgram.net/articles/img/bg06.png)

###文字の指定
表示される文字はデフォルトで"BitGram"となっていますが、コンストラクターの3番目に８文字以内の文字を指定します。以下の例では"ABCDEFGH"を指定しています。

	<!DOCTYPE html>
	<html>
	  <head>
	    <script type="text/javascript" src="http://www.bitgram.net/js/bitgram.js"></script>
	    <script type="text/javascript">
	       window.onload = function() {
	         new bitgram.Logo("logo", "input", "ABCDEFGH");
	       };
	    </script>
	  </head>
	  <body>
	     <div id="logo">
	       <input id="input">
	     </div>
	  </body>
	</html>

![bg01](http://www.bitgram.net/articles/img/bg07.png)

###スタイルシート定義
生成されるHTMLエレメントは次のクラス名で定義されていますので、それに合わせてスタイルシートを変更することができます。

文字部分: .bitgram_sign  
16進数文字部分: .bitgram_hex

例）

	<!DOCTYPE html>
	<html>
	  <head>
	    <script type="text/javascript" src="http://www.bitgram.net/js/bitgram.js"></script>
	    <script type="text/javascript">
	       window.onload = function() {
	         new bitgram.Logo("logo", "input", "ABCDEFGH");
	       };
	    </script>
	    <style>
	      #logo { text-align: center; }
	      .bitgram_sign { font-size: 24pt;
	                      font-weight: bold;
	                      color: red; }
	      .bitgram_hex  { font-size: 11pt;
	                      color: blue; }
	    </style>
	  </head>
	  <body>
	     <div id="logo">
	       <input id="input">
	     </div>
	  </body>
	</html>

![bg01](http://www.bitgram.net/articles/img/bg08.png)

###bitgram.Logo Costructor

	bitGram.Logo( containerId, 
	              inputId, 
	              sign, 
	              color, 
	              gridNum, 
	              cellSize, 
	              canvasId )

containerId - ロゴを表示するHTMLエレメントのID。 （必須)  
inputId: ロゴの文字を変更するためのテキストフィールドのID。  
sign: 文字の初期値。(デフォルト: "BitGram")  
color: ロゴのビットが立っているセルの色。(デフォルト: "#666")  
gridNum: ロゴのグリッド内のセルの数 (デフォルト: 8)  
cellSize: セルのピクセルサイズ　(デフォルト: 20)  
canvasId: ロゴのキャンバスに定義したいID (デフォルト: "bitgram_canvas") 

###bitgram.Logo Methods
init: 			初期化。  
setSign: 		文字（サイン)を設定し、canvasと文字を書き換える。  
draw: 			canvas, 文字、16進数の文字を書き換える。  
changeColorMode: カラーモード(0 - default, 1 - random, 2 - multi random) をきり替える。  
getSignAsHex: 	文字列(this.sign)を16進数に変換する。  
getSignAsBin: 	文字列(this.sign)を2進数に変換する。  
updateCells: 	文字列(this.sign)に基づいてgridのデータを更新する。  
getRandomColor: 	this.defaults.COLORSから任意の１つを取り出す。  



