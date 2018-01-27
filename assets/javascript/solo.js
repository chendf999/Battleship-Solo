$(document).ready(function() {

	var shipId;

	var xAxis = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	var yAxis = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];

	var playerGrid = xAxis.length * yAxis.length;

	// var database = firebase.database();

	$('.screen img').detach();

  var myShip =[];
	var pcShip =[];

	reset_game();
	function reset_game(){
		$('.guess').detach();
		$('.screen.player').hide();
		$('.screen.opponent').show();

		$('.board .player').css('opacity', 1);
		$('.board .opponent').css('opacity', .5);
	}

	/*-------------------------------------
	| print grid
	-------------------------------------*/

	for (var i = 0; i < xAxis.length; i++) {
		for (var j = 0; j < yAxis.length; j++) {
			var playerBlock = $('<div class="block">');
			var opponentBlock = $('<div class="block">');

			var playerGrid = $('<div class="block">');

			var water = $('<img src="./assets/images/waterTile.png">');

			playerBlock.attr('id', xAxis[i]+ yAxis[j]).attr('index', xAxis[i]+yAxis[j]);
			playerGrid.attr('id', 'screen'+ xAxis[i]+ yAxis[j]).attr('index', xAxis[i]+yAxis[j]);
			opponentBlock.attr('id', 'op'+xAxis[i]+ yAxis[j]).attr('index', xAxis[i]+yAxis[j]);

			$('.board .player').append(playerBlock);
			$('.board .opponent').append(opponentBlock);
			$('.screen.player').append(playerGrid);
		}
	}

	$('.block').append(water);

	/*-------------------------------------
	| snap and rotate
	-------------------------------------*/

	var snap = $('<div class="snap">');
	$('.board .player .block').append(snap);

	$('.ship').draggable({
		snap: '.snap',
		snapMode: 'inner',
		containment: '.board .player'
	});

	$('.ship').on('click', function(){
		var rotate = $(this).attr('rotate');
		var size = $(this).attr('size');

		if (rotate === 'false') {
			$(this).attr('rotate', 'true');
			$(this).css('height',size).css('width','26px');
		} else {
			$(this).attr('rotate', 'false');
			$(this).css('height','26px').css('width',size);
		}
	});

	/*-------------------------------------
	| place/ confirm/ reset
	-------------------------------------*/

	$('#start').on('click', function(){
    pc_setup();

		for(var i=1; i< 6; i++){
			shipId = 'ship'+i;

			for (var j = 0; j < xAxis.length; j++) {
				for (var k = 0; k < yAxis.length; k++) {
					var blockId = xAxis[j] + yAxis[k];
					overlap(shipId, blockId);
				}
			}
		}

		$('.screen.opponent').hide();
		$('.board .player').css('opacity', .5);
		$('.board .opponent').css('opacity', 1);

		$('.screen.player').show();
		// console.log(myShip);
	});

	/*-------------------------------------
	| check overlap
	-------------------------------------*/

	function overlap(shipId, blockId) {
		var blockDiv = $('#' +blockId);
		var shipDiv = $('#' +shipId);

		var x1 = blockDiv.offset().left;
		var y1 = blockDiv.offset().top;
		var h1 = blockDiv.outerHeight(true);
		var w1 = blockDiv.outerWidth(true);
		var b1 = y1 + h1;
		var r1 = x1 + w1;

		var x2 = shipDiv.offset().left;
		var y2 = shipDiv.offset().top;
		var h2 = shipDiv.outerHeight(true);
		var w2 = shipDiv.outerWidth(true);

		var b2 = y2 + h2;
		var r2 = x2 + w2;

		if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) {
			// $('#'+blockId).removeClass('occupied');
		} else {
			// blockDiv.addClass('occupied').addClass(shipId);
      myShip.push(blockId);
		}
	}

	/*-------------------------------------
	| pc place ship
	-------------------------------------*/

	function pc_setup(){
		generate_ship(2);
		generate_ship(3);
		generate_ship(3);
		generate_ship(4);
		generate_ship(5);
		check_repeat();
	}

	function generate_ship(ship_length){
		var ship_head = '';
		var headX;
		var headY;
		var this_ship = [];

		start_from();
		function start_from(){
				headX = Math.floor(Math.random()*10);
				headY = Math.floor(Math.random()*10);
				ship_head = xAxis[headX] + yAxis[headY];
				// console.log(ship_head);

				head_to();
		}

		function head_to(){
			var d = Math.floor(Math.random()*2);

			/* horizontal -------------------------------*/
			if(d ===0){
				var tailX = headX + ship_length;

				if(tailX > 9){
					start_from();
				} else {
					for(var j=0; j<ship_length; j++){
						var bodyX = headX +j;
						var bodyY = headY;
						var ship_body = xAxis[bodyX] + yAxis[bodyY];
						this_ship.push(ship_body);
					}
				}
			}
			/* else d ===1, vertical -------------------------------*/
			else {
				var tailY = headY + ship_length;

				if(tailY > 9){
					start_from();
				} else {
					for(var j=0; j<ship_length; j++){
						var bodyY = headY +j;
						var bodyX = headX;
						var ship_body = xAxis[bodyX] + yAxis[bodyY];
						this_ship.push(ship_body);
					}
				}
			}
		}

		for(var k=0; k<ship_length; k++){
			pcShip.push(this_ship[k]);
		}
	}

	function check_repeat(){
		for (var i=0; i<pcShip.length; i++){
			for(var j=0; j<pcShip.length; j++){
				if((pcShip[i] === pcShip[j]) && (i!==j)){
					pcShip = [];
					pc_setup();
					return
				}
			}
		}
		// console.log(pcShip);
		// for(var i=0; i<pcShip.length; i++){
		// 	$('#op'+ pcShip[i]).append('<img style="opacity:.5" src="./assets/images/hit.png">');
		// }
	}

	/*-------------------------------------
	| guess in turns
	-------------------------------------*/

	var hitSrc = './assets/images/hit.png';
	var missSrc = './assets/images/miss.png';

	$('.board .opponent .block').on('click', function(){

		var blockIndex = $(this).attr('index');
		var check = pcShip.indexOf(blockIndex);

		if(check !== -1){
			$('#op'+ blockIndex).find('img').attr('src', hitSrc);
		} else {
			$('#op'+ blockIndex).find('img').attr('src', missSrc);
		}

		pc_guess_easy();
	});

	/*-------------------------------------
	| computer guess
	-------------------------------------*/

	var pc_guessed = [];
	var pc_guess = '';

	function pc_guess_easy(pcX, pcY){
		var pcX = Math.floor(Math.random()*10);
		var pcY = Math.floor(Math.random()*10);
		pc_guess = xAxis[pcX] + yAxis[pcY];

		console.log(pc_guess);
		if_guessed(pc_guess);
	}

	function if_guessed(pc_guess){
		var index = pc_guessed.indexOf(pc_guess);
		if(index !==-1){
			pc_guess_easy();
		} else {
			pc_guessed.push(pc_guess);
			check_hit(pc_guess);
			return
		}
	}

	function check_hit(pc_guess){
		var index = myShip.indexOf(pc_guess);
		console.log(index);
		if(index == -1){
			$('#'+ pc_guess).find('img').attr('src', missSrc);
			console.log('miss');
		} else {
			$('#'+ pc_guess).find('img').attr('src', hitSrc);
		}
	}

});
