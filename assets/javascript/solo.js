$(document).ready(function() {

	var shipId;

	var xAxis = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	var yAxis = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];

	var playerGrid = xAxis.length * yAxis.length;

  var myShip =[];
	var pcShip =[];
	var myGuess =[];
	var myWin = 0;
	var pcWin = 0;

	reset_game();
	function reset_game(){
		$('.guess').detach();
		$('.screen img').detach();
		$('.screen.player').hide();
		$('.screen.opponent').show();

		$('.pcShip').hide();
		$('.board .player').css('opacity', 1);
		$('.board .opponent').css('opacity', .5);

		myShip =[];
		pcShip =[];
		myGuess =[];
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

		for(var i=1; i< 6; i++){
			shipId = 'ship'+i;
			for (var j = 0; j < xAxis.length; j++) {
				for (var k = 0; k < yAxis.length; k++) {
					var blockId = xAxis[j] + yAxis[k];
					overlap(shipId, blockId);
				}
			}
		}

		for(var j=0; j < myShip.length; j++){
			for (var k = 0; k < myShip.length; k++) {
				if(myShip[j] === myShip[k] && j!==k){
					$('#notification').html('[ Oops...check your ship location. ]');
					myShip = [];
					return
				}
			}
		}

		if(myShip.length !== 17){
			$('#notification').html('[ Oops...check your ship location. ]');
			myShip = [];
		} else {
			pc_setup();

			$('.screen.opponent').hide();
			$('.board .player').css('opacity', .5);
			$('.board .opponent').css('opacity', 1);

			$('.screen.player').show();
			$('#notification').html('[ Your Turn ]');
		}
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
		generate_ship(2,'pcShip1');
		generate_ship(3,'pcShip2');
		generate_ship(3,'pcShip3');
		generate_ship(4,'pcShip4');
		generate_ship(5,'pcShip5');
		check_repeat();
		// console.log(pcShip);
	}

	function generate_ship(ship_length, shipId){
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

				var top = headX*36+4;
				var left = headY*36+414;

				$('#'+shipId).css('top',top).css('left', left);
				head_to();
		}

		function head_to(){
			var d = Math.floor(Math.random()*2);

			/* vertical -------------------------------*/
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

						var size = $('#'+shipId).attr('size');
						$('#'+shipId).css('width','28px').css('height', size);
					}
				}
			}
			/* else d ===1, horizontal -------------------------------*/
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

						var size = $('#'+shipId).attr('size');
						$('#'+shipId).css('width', size).css('height', '28px');
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
		var guessed = myGuess.indexOf(blockIndex);

		if(guessed === -1){
			myGuess.push(blockIndex);

			if(check !== -1){
				$('#op'+ blockIndex).find('img').attr('src', hitSrc);
				myWin++;
				check_sink(blockIndex);
				win_loss();
			} else {
				$('#op'+ blockIndex).find('img').attr('src', missSrc);
				$('#notification').html('[ Your Turn ]');
			}

		pc_guess();
		}
	});

	/*-------------------------------------
	| show pc ships
	-------------------------------------*/

	var pcShip1 = 2;
	var pcShip2 = 3;
	var pcShip3 = 3;
	var pcShip4 = 4;
	var pcShip5 = 5;

	check_sink();
	function check_sink(blockIndex){
		var hit = pcShip.indexOf(blockIndex);

		if(-1< hit && hit<2){ /* 0,1---------*/
			pcShip1--;
		} else if (1< hit && hit<5){ /* 2,3,4---------*/
			pcShip2--;
		} else if (4< hit && hit<8){ /* 5,6,7---------*/
			pcShip3--;
		} else if (7< hit && hit<12){ /* 8,9,10,11---------*/
			pcShip4--;
		} else if (11< hit && hit<17){ /* 12,13,14,15,16---------*/
			pcShip5--;
		}

		if(pcShip1 === 0){ $('#pcShip1').show().animate({'opacity':.5},1000);}
		if(pcShip2 === 0){ $('#pcShip2').show().animate({'opacity':.5},1000);}
		if(pcShip3 === 0){ $('#pcShip3').show().animate({'opacity':.5},1000);}
		if(pcShip4 === 0){ $('#pcShip4').show().animate({'opacity':.5},1000);}
		if(pcShip5 === 0){ $('#pcShip5').show().animate({'opacity':.5},1000);}

	}

	/*-------------------------------------
	| computer guess easy
	-------------------------------------*/

	// var pc_guessed = [];
	// var pc_guess = '';
  //
	// function pc_guess_easy(pcX, pcY){
	// 	var pcX = Math.floor(Math.random()*10);
	// 	var pcY = Math.floor(Math.random()*10);
	// 	pc_guess = xAxis[pcX] + yAxis[pcY];
  //
	// 	if_guessed(pc_guess);
	// }
  //
	// function if_guessed(pc_guess){
	// 	var index = pc_guessed.indexOf(pc_guess);
	// 	if(index !==-1){
	// 		pc_guess_easy();
	// 	} else {
	// 		pc_guessed.push(pc_guess);
	// 		check_hit(pc_guess);
	// 		return
	// 	}
	// }
  //
	// function check_hit(pc_guess){
	// 	var index = myShip.indexOf(pc_guess);
  //
	// 	if(index == -1){
	// 		$('#'+ pc_guess).find('img').attr('src', missSrc);
	// 	} else {
	// 		$('#'+ pc_guess).find('img').attr('src', hitSrc);
	// $('#notification').html('[ Watch Out! ]');
	//		pcWin++;
	// 		win_loss();
	// 	}
	// }

	/*-------------------------------------
	| computer guessed medium
	-------------------------------------*/

	var pcX;
	var pcY;
	var pcGuess = '';
	var pcGuessed = [];
	var pcHit = 'random';
	var pcDirection = 'right';
	var stepBack = 2;

	function pc_guess(){

		if(pcWin < 15){
			if(pcHit === 'random'){
				random_check();
			} else if(pcHit === 'around'){
				check_around();
			} else if(pcHit === 'next') {
				check_next();
			} else if(pcHit === 'back'){
				check_back();
			}
		} else {
			final_check();
		}

		// console.log(pcHit, pcDirection, stepBack);
	}

	/*-------------------------------------
	| random guess
	-------------------------------------*/

	function random_check(){

		generate_guess();
		function generate_guess(){
			pcX = Math.floor(Math.random()*10);
			pcY = Math.floor(Math.random()*10);
			pcGuess = xAxis[pcX] + yAxis[pcY];
			check_repeat(pcGuess);
		}

		function check_repeat(pcGuess){
			var guessed = pcGuessed.indexOf(pcGuess);

			if(guessed !== -1){
				generate_guess();
			} else {
				pcGuessed.push(pcGuess);

				hit_miss(pcGuess);
			}
		}

		function hit_miss(pcGuess){
				var index = myShip.indexOf(pcGuess);

				if(index === -1){
					pcHit = 'random';
					$('#'+ pcGuess).find('img').attr('src', missSrc);
				} else {
					pcHit = 'around';
					$('#'+ pcGuess).find('img').attr('src', hitSrc);
					pcWin++;
					win_loss();
				}
			}
		}

	/*-------------------------------------
	| check around
	-------------------------------------*/

	function check_around(){
		get_coordinate();

		function get_coordinate(){
			if(pcDirection === 'right'){
				if(yAxis[pcY+1] !== undefined && pcGuessed.indexOf(xAxis+yAxis[pcY+1]) === -1){
					pcY = pcY+1;
					hit_miss();
				} else{
					change_direction();
				}
			} else if(pcDirection === 'down'){
				if(xAxis[pcX+1] !== undefined && pcGuessed.indexOf(xAxis[pcX+1]+yAxis[pcY]) === -1){
					pcX = pcX+1;
					hit_miss();
				} else{
					change_direction();
				}
			} else if(pcDirection === 'left'){
				if(yAxis[pcY-1] !== undefined && pcGuessed.indexOf(xAxis+yAxis[pcY-1]) === -1){
					pcY = pcY-1;
					hit_miss();
				} else{
					change_direction();
				}
			} else if(pcDirection === 'up'){
				if(xAxis[pcX-1] !== undefined && pcGuessed.indexOf(xAxis[pcX-1]+yAxis[pcY]) === -1){
					pcX = pcX -1;
					hit_miss();
				} else{
					change_direction();
				}
			} else {
				pcDirection = 'right';
				random_check();
			}
		}

		function change_direction(){
			if(pcDirection === 'right'){
				pcDirection = 'down';
				get_coordinate();
			} else if (pcDirection === 'down') {
				pcDirection = 'left';
				get_coordinate();
			} else if (pcDirection === 'left') {
				pcDirection = 'up';
				get_coordinate();
			} else if (pcDirection === 'up') {
				pcDirection = 'right';
				get_coordinate();
			}
		}

		function hit_miss(){
			pcGuess = xAxis[pcX]+yAxis[pcY];
			pcGuessed.push(pcGuess);
			var index = myShip.indexOf(pcGuess);

			if(index === -1){
				pcHit = 'around';
				$('#'+ pcGuess).find('img').attr('src', missSrc);

				// reset coordinates back, set direction for next round
				if(pcDirection === 'right'){
					pcY = pcY-1;
					pcDirection = 'down';
				} else if(pcDirection === 'down'){
					pcX = pcX-1;
					pcDirection = 'left';
				} else if(pcDirection === 'left'){
					pcY = pcY+1;
				} else if(pcDirection === 'up'){
					pcX = pcX +1;
					pcDirection = 'right';
				}

			} else {
				pcHit = 'next';
				$('#'+ pcGuess).find('img').attr('src', hitSrc);
				pcWin++;
				win_loss();
			}
		}
	}

/*-------------------------------------
| check next
-------------------------------------*/

function check_next(){
	stepBack++;

	if(pcDirection === 'right'){ // continue right
		if(yAxis[pcY+1] !==undefined && pcGuessed.indexOf(xAxis[pcX]+yAxis[pcY+1]) === -1){
			pcY = pcY +1;
			hit_miss();
		} else {
			pcDirection = 'left';
			check_back();
		}
	} else if(pcDirection === 'down'){ // continue down
		if(xAxis[pcX+1] !==undefined && pcGuessed.indexOf(xAxis[pcX+1]+yAxis[pcY]) === -1){
			pcX = pcX +1;
			hit_miss();
		} else {
			pcDirection = 'up';
			check_back();
		}
	} else if(pcDirection === 'left'){ // continue left
		if(yAxis[pcY-1] !==undefined && pcGuessed.indexOf(xAxis[pcX]+yAxis[pcY-1]) === -1){
			pcY = pcY -1;
			hit_miss();
		} else {
			pcDirection = 'right';
			check_back();
		}
	} else if(pcDirection === 'up'){ // continue up
		if(xAxis[pcX-1] !==undefined && pcGuessed.indexOf(xAxis[pcX-1]+yAxis[pcY]) === -1){
			pcX = pcX -1;
			hit_miss();
		} else {
			pcDirection = 'down';
			check_back();
		}
	}

	function hit_miss(){
		pcGuess = xAxis[pcX]+yAxis[pcY];
		pcGuessed.push(pcGuess);
		var index = myShip.indexOf(pcGuess);

		if(index === -1){
			pcHit = 'back';
			$('#'+ pcGuess).find('img').attr('src', missSrc);

			// reset direction for next round
			if(pcDirection === 'right'){
				pcDirection = 'left';
			} else if(pcDirection === 'down'){
				pcDirection = 'up';
			} else if(pcDirection === 'left'){
				pcDirection = 'right';
			} else if(pcDirection === 'up'){
				pcDirection = 'down';
			}
		} else {
			pcHit = 'next';
			$('#'+ pcGuess).find('img').attr('src', hitSrc);
			$('#notification').html('[ Watch Out ]');
			pcWin++;
			win_loss();
		}
	}
}

/*-------------------------------------
| check back
-------------------------------------*/

function check_back(){
	if(pcDirection === 'right'){ // continue right
		if(yAxis[pcY+stepBack] !==undefined && pcGuessed.indexOf(xAxis[pcX]+yAxis[pcY+stepBack]) === -1){
			pcY = pcY +stepBack;
			hit_miss();
		} else {
			pcDirection = 'right';
			stepBack = 2;
			random_check();
		}
	} else if(pcDirection === 'down'){ // continue down
		if(xAxis[pcX+stepBack] !==undefined && pcGuessed.indexOf(xAxis[pcX+stepBack]+yAxis[pcY]) === -1){
			pcX = pcX +stepBack;
			hit_miss();
		} else {
			pcDirection = 'right';
			stepBack = 2;
			random_check();
		}
	} else if(pcDirection === 'left'){ // continue left
		if(yAxis[pcY-stepBack] !==undefined && pcGuessed.indexOf(xAxis[pcX]+yAxis[pcY-stepBack]) === -1){
			pcY = pcY -stepBack;
			hit_miss();
		} else {
			pcDirection = 'right';
			stepBack = 2;
			random_check();
		}
	} else if(pcDirection === 'up'){ // continue up
		if(xAxis[pcX-stepBack] !==undefined && pcGuessed.indexOf(xAxis[pcX-stepBack]+yAxis[pcY]) === -1){
			pcX = pcX -stepBack;
			hit_miss();
		} else {
			pcDirection = 'right';
			stepBack = 2;
			random_check();
		}
	}

	function hit_miss(){
		pcGuess = xAxis[pcX]+yAxis[pcY];
		pcGuessed.push(pcGuess);
		var index = myShip.indexOf(pcGuess);

		if(index === -1){
			pcHit = 'random';
			pcDirection = 'right';
			stepBack = 2;

			$('#'+ pcGuess).find('img').attr('src', missSrc);
		} else {
			pcHit = 'next';
			$('#'+ pcGuess).find('img').attr('src', hitSrc);
			pcWin++;
			win_loss();
		}
	}
}

/*-------------------------------------
| final cheat
-------------------------------------*/

function final_check(){
	for(var i=0; i<myShip.length; i++){
		var index = pcGuessed.indexOf(myShip[i]);
		if(index ===-1){
			pcGuess = myShip[i];
			pcGuessed.push(pcGuess);
			pcWin++;

			$('#'+ pcGuess).find('img').attr('src', hitSrc);
			win_loss();
			break
		}
	}
}

/*-------------------------------------
| win loss
-------------------------------------*/

function win_loss(){
	if(myWin === 17){
		$('.screen.opponent').show();
		$('#notification').html('[ You Win! Refresh to start again. ]');

	} else if (pcWin === 17){
		$('.screen.opponent').show();
		$('#notification').html('[ Game Over. Refresh to start again. ]');

	}
}

/*-------------------------------------
| show info
-------------------------------------*/

$('#lightbox-intro').hide().css('opacity',0);

$('.how-to').on('click', function(){
	$('#lightbox-intro').show();
	$('#lightbox-intro').animate({'opacity':1},800);
	$('body').css('overflow-y','hidden');
});

$('#lightbox-intro .close-btn').on('click', function(){
	$('#lightbox-intro').animate({'opacity':0},800);
	setTimeout(function(){$('#lightbox-intro').hide();}, 800);
	$('body').css('overflow-y','scroll');
});

$('#lightbox-about').hide().css('opacity',0);

$('.about').on('click', function(){
	$('#lightbox-about').show();
	$('#lightbox-about').animate({'opacity':1},800);
	$('body').css('overflow-y','hidden');
});

$('#lightbox-about .close-btn').on('click', function(){
	$('#lightbox-about').animate({'opacity':0},800);
	setTimeout(function(){$('#lightbox-about').hide();}, 800);
	$('body').css('overflow-y','scroll');
});

});
