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
    pc_place_ship();

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


});
