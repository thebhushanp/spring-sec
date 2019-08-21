var dX, dY;
var winW = window.innerWidth;
var winH = window.innerHeight * 0.995;
var dragStrX, dragStrY;
var validDropZones = [];
var leftCards = [];
var leftCardEnd = false;
var rightCards = [];
var rightCardEnd = false;
var topCards = [];
var topCardEnd = false;

var wsendpoint = null;
var stompClient = null;
var revision = 0;
var game = null;
var myPosition, playerOrder, displayName;
var gameOrder = [];
var bulbOrder = [];
var selfCardsImages = [];
var imgPass;

var config = {
	type : Phaser.AUTO,
	parent : 'phaser-example',
	scale : {
		mode : Phaser.Scale.FIT,
		parent : 'phaser-example',
		autoCenter : Phaser.Scale.CENTER_BOTH,
		width : winW,
		height : winH
	},
	autoResize : true,
	scene : {
		preload : preload,
		create : create
	}
};

var game = new Phaser.Game(config);

function preload() {
	this.load.path = "../images/";
	this.load.image('sky', 'canvas/user.png');
	this.load.image('card_face', 'cards/back.gif');
	this.load.image('pass', 'canvas/pass.png');
	this.load.image('bulb', 'canvas/bulb.png');
	loadCards(this);
}

function create() {
	game = this;
	this.cameras.main.backgroundColor.setTo(143, 244, 66);
	var btnLogout = this.add.text(getRealX(90), getRealY(3),
			localStorage.getItem('username') + '\nLogout', {
				fill : 'red'
			}).setInteractive().on('pointerdown', function() {
		disconnect();
		window.location.href = "/logout";
	});
	sockInit();
	renderCardsPlaceholders(this);
	enableDrag(this);
}

function loadCards(gameIns) {
	for (var i = 1; i < 53; i++) {
		gameIns.load.image('card_' + i, 'cards/' + i + '.gif');
	}
}

function renderSelfCards(cards) {
	var gap = 2;
	var haveHeart7 = false;
	for (var i = 0; i < cards.length; i++) {
		if (cards[i] == 7) {
			haveHeart7 = true;
		}
		gap = gap + 2.1;
		var image = this.game.add.image(getRealX(gap), getRealY(92),
				'card_' + cards[i]).setOrigin(0.5);
		image.name = cards[i];
		gap = gap + 5;
		selfCardsImages.push(image);
	}
	imgPass = game.add.sprite(getRealX(gap + 2), getRealY(92), 'pass');
	imgPass.displayWidth = getRealX(5);
	imgPass.displayHeight = getRealX(5);
	imgPass.on('pointerover', function() {
		this.imgPass.setTint(0xf0ff00);
	}, this)
	imgPass.on('pointerout', function() {
		this.imgPass.setTint(0xffffff);
	}, this)
	imgPass.on('pointerdown', function() {
		var data = '{"card":0,"col_index":0}'
		var resCode = sendMessageViaAjax(JSON.parse(data), 'PLAYED_CARD');
		if (resCode == 200) {
			imgPass.disableInteractive();
			makeMyCardsInteractive(false);
			// glow next player's bulb
			adjustVisibilityOfBulb(myPosition + 1, true);
		} else {
			alert("Play valid card")
		}
	});
	var bulbS = this.game.add.image(getRealX(1), getRealY(92), 'bulb')
			.setOrigin(0.5);
	bulbS.displayWidth = getRealX(2.5);
	bulbS.displayHeight = getRealX(2.5);
	bulbS.visible = false;
	bulbOrder[myPosition] = bulbS;
	if (haveHeart7) {
		makeMyCardsInteractive(true);
	}
}

function renderOtherPlayersCards(playerInfo) {
	var index = (myPosition + 1) % 4;
	game.load.on('filecomplete', fileLoadComplete, this);
	// left player
	for (var i = 0; i < 13; i++) {
		var img = this.game.add.image(getRealX(5), getRealY(45), 'card_face')
				.setOrigin(0);
		img.setAngle(-12 * i);
		leftCards.push(img);
	}
	game.load.image('left', playerInfo[index.toString()].profile_pic_url);
	gameOrder[index] = leftCards;
	var bulbL = this.game.add.image(getRealX(5), getRealY(27), 'bulb')
			.setOrigin(0.5);
	bulbL.displayWidth = getRealX(2.5);
	bulbL.displayHeight = getRealX(2.5);
	bulbL.visible = false;
	bulbOrder[index] = bulbL;

	// top player
	for (var i = 0; i < 13; i++) {
		var img = this.game.add.image(getRealX(50), getRealY(7.5), 'card_face')
				.setOrigin(0);
		img.setAngle(320 + 12 * i);
		topCards.push(img);
	}
	index = (index + 1) % 4;
	game.load.image('top', playerInfo[index.toString()].profile_pic_url);
	gameOrder[index] = topCards;
	var bulbT = this.game.add.image(getRealX(40), getRealY(7.5), 'bulb')
			.setOrigin(0.5);
	bulbT.displayWidth = getRealX(2.5);
	bulbT.displayHeight = getRealX(2.5);
	bulbT.visible = false;
	bulbOrder[index] = bulbT;

	// right player
	for (var i = 0; i < 13; i++) {
		var img = this.game.add
				.image(getRealX(97.5), getRealY(45), 'card_face').setOrigin(1,
						0);
		img.setAngle(12 * i - 18);
		rightCards.push(img);
	}
	index = (index + 1) % 4;
	var bulbR = this.game.add.image(getRealX(97.5), getRealY(30), 'bulb')
			.setOrigin(0.5);
	bulbR.displayWidth = getRealX(2.5);
	bulbR.displayHeight = getRealX(2.5);
	bulbR.visible = false;
	bulbOrder[index] = bulbR;
	game.load.image('right', playerInfo[index.toString()].profile_pic_url);
	gameOrder[index] = rightCards;
	adjustVisibilityOfBulb(0, true);
	game.load.start();
}

function fileLoadComplete(key, type, texture) {
	if (key == 'left') {
		var img = game.add.image(getRealX(5), getRealY(45), key);
		img.displayWidth = getRealX(5);
		img.displayHeight = getRealX(5);
	} else if (key == 'top') {
		var img = game.add.image(getRealX(50), getRealY(7.5), key);
		img.displayWidth = getRealX(5);
		img.displayHeight = getRealX(5);
	} else if (key == 'right') {
		var img = game.add.image(getRealX(97.55), getRealY(45), key);
		img.displayWidth = getRealX(5);
		img.displayHeight = getRealX(5);
	}
}

function renderCardsPlaceholders(game) {
	// 1st from left
	game.add.image(getRealX(35), getRealY(50), 'card_face');
	var z1 = game.add
			.zone(getRealX(35), getRealY(50), getRealX(2), getRealY(4))
			.setOrigin(0.5);
	z1.name = 'init';
	z1.idx = 1;
	validDropZones[0] = z1;

	// 2nd from left
	game.add.image(getRealX(45), getRealY(50), 'card_face');
	var z2 = game.add
			.zone(getRealX(45), getRealY(50), getRealX(2), getRealY(4));
	z2.name = 'init';
	z2.idx = 2;
	validDropZones[1] = z2;

	// 3rd from left
	game.add.image(getRealX(55), getRealY(50), 'card_face');
	var z3 = game.add
			.zone(getRealX(55), getRealY(50), getRealX(2), getRealY(4));
	z3.name = 'init';
	z3.idx = 3;
	validDropZones[2] = z3;

	// 4th from left
	game.add.image(getRealX(65), getRealY(50), 'card_face');
	var z4 = game.add
			.zone(getRealX(65), getRealY(50), getRealX(2), getRealY(4));
	z4.name = 'init';
	z4.idx = 4;
	validDropZones[3] = z4;
}

function getRealX(percentage) {
	return winW * percentage / 100;
}

function getRealY(percentage) {
	return winH * percentage / 100;
}

function enableDrag(game) {
	game.input.on('dragstart', function(pointer, gameObject) {
		dragStrX = gameObject.x;
		dragStrY = gameObject.y;
		game.children.bringToTop(gameObject);
	}, game);

	game.input.on('drag', function(pointer, gameObject, dragX, dragY) {
		gameObject.x = dragX;
		gameObject.y = dragY;
	});

	game.input
			.on(
					'dragend',
					function(pointer, gameObject, dragX, dragY) {
						var cardBounds = gameObject.getBounds();
						var validDropZone;
						for (var i = 0; i < validDropZones.length; i++) {
							var overlapping = Phaser.Geom.Intersects
									.RectangleToRectangle(cardBounds,
											validDropZones[i].getBounds());
							var isNameSame = false;
							if (validDropZones[i].name == gameObject.name) {
								isNameSame = true;
							}
							if (overlapping
									&& (isNameSame || (validDropZones[i].name == 'init' && isSatti(gameObject.name)))) {
								validDropZone = validDropZones[i];
							}
						}
						if (validDropZone) {
							// send card value to server
							var data = '{"card":' + gameObject.name
									+ ',"col_index":' + validDropZone.idx + '}'
							// sendMessage(JSON.parse(data), 'PLAYED_CARD');
							var resCode = sendMessageViaAjax(JSON.parse(data),
									'PLAYED_CARD');
							if (resCode == 200) {
								rmByVal(validDropZones, validDropZone);
								if (validDropZone.name == 'init') {
									buildUpperZone(game, validDropZone,
											gameObject.name);
									buildLowerZone(game, validDropZone,
											gameObject.name);
								} else if (validDropZone.name % 13 < 7
										&& validDropZone.name % 13 != 1) {
									buildUpperZone(game, validDropZone,
											gameObject.name);
								} else if (validDropZone.name % 13 != 0) {
									buildLowerZone(game, validDropZone,
											gameObject.name);
								}
								gameObject.x = validDropZone.getCenter().x;
								gameObject.y = validDropZone.getCenter().y;
								gameObject.disableInteractive();
								rmByVal(selfCardsImages, gameObject);
								makeMyCardsInteractive(false);
								// glow next player's bulb
								adjustVisibilityOfBulb(myPosition + 1, true);
							} else {
								alert('Illegal card')
								gameObject.x = dragStrX;
								gameObject.y = dragStrY;
							}
						} else {
							gameObject.x = dragStrX;
							gameObject.y = dragStrY;
						}
					});
}

function rmByVal(arr, val) {
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] === val) {
			arr.splice(i, 1);
		}
	}
}

function isSatti(name) {
	if (name == 7 || name == 20 || name == 33 || name == 46) {
		return true;
	}
	return false;
}

function drawRect(game, bounds) {
	var dropzone1 = game.add.graphics();
	dropzone1.lineStyle(2, 0xffff00, 1);
	var rect = new Phaser.Geom.Rectangle(bounds.x, bounds.y, bounds.width,
			bounds.height);
	dropzone1.strokeRectShape(rect);
}

function removeCard(idx) {
	gameOrder[idx].pop().destroy();
}

function removeCardFromLeft() {
	if (leftCardEnd) {
		leftCards.pop().destroy();
	} else {
		leftCards.shift().destroy();
	}
	leftCardEnd = !leftCardEnd;
}

function removeCardFromRight() {
	if (rightCardEnd) {
		rightCards.pop().destroy();
	} else {
		rightCards.shift().destroy();
	}
	rightCardEnd = !rightCardEnd;
}

function removeCardFromTop() {
	if (topCardEnd) {
		topCards.pop().destroy();
	} else {
		topCards.shift().destroy();
	}
	topCardEnd = !topCardEnd;
}

function sockInit() {
	var socket = new SockJS('/badam7');
	stompClient = Stomp.over(socket);
	wsendpoint = getUrlParameter("id");
	stompClient.connect({}, function(frame) {
		stompClient.subscribe('/geb/' + wsendpoint, function(messageOutput) {
			onReceive(JSON.parse(messageOutput.body));
		});
	});
}

// websocket related code
function disconnect() {
	if (stompClient != null) {
		stompClient.disconnect();
	}
	wsendpoint = getUrlParameter("ws");
}

function onpageload() {
	// var span = document.getElementsByClassName("username");
	displayName = localStorage.getItem('username');
	// span[0].innerText = "Welcome " + displayName;
	disconnect();
}

function sendMessage(data, type) {
	revision++;
	stompClient.send("/app/geb/" + wsendpoint, {}, JSON.stringify({
		'revision' : revision,
		'data' : data,
		'type' : type
	}));
}

function sendMessageViaAjax(data, type) {
	var returnCode = null;
	revision++;
	var payload = JSON.stringify({
		'revision' : revision,
		'data' : data,
		'type' : type
	});
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4) {
			// console.log(xmlhttp.responseText);
			returnCode = this.status;
		}
	};
	// FIXME this is synchronized req, make it asynch
	xmlhttp.open("POST", "/api/game/card-played/" + wsendpoint, false);
	xmlhttp.setRequestHeader('Content-type', 'application/JSON');
	xmlhttp.send(payload);
	return returnCode;
}

function onReceive(msg) {
	if (msg.type == 'GAME_START') {
		dealCards(msg);
	} else if (msg.type == 'PLAYED_CARD') {
		cardPlayed(msg);
	} else if (msg.type == 'ERROR') {
		error(msg);
	}
}

function error(msg) {
	revision = revision - msg.revision;
	alert(msg.msg)
}

function dealCards(msg) {
	this.playerOrder = msg.data.p_order;
	Object.keys(playerOrder).forEach(function(key, index) {
		if (playerOrder[key].display_name == this.displayName) {
			myPosition = parseInt(key, 10);
		}
	});
	var cards = msg.data.cards;
	renderSelfCards(cards);
	renderOtherPlayersCards(playerOrder);
}

function cardPlayed(msg) {
	var data = msg.data;
	var theEnd = data.is_game_finished;
	revision = msg.revision;
	if (!theEnd) {
		if (data.played_card != 0) {
			// remove one face card from player
			removeCard(data.played_by);
			displayCardToTable(data.played_card, data.col_index);
		}
		if ((data.played_by + 1) % 4 == myPosition) {
			makeMyCardsInteractive(true);
			adjustVisibilityOfBulb(data.played_by, false);
		} else {
			adjustVisibilityOfBulb(data.played_by + 1, true);
			adjustVisibilityOfBulb(data.played_by, false);
		}
	} else {
		alert("Game Ends");
		console.log(data.scorecard);
	}

}

function buildUpperZone(game, validDropZone, name) {
	var z1 = game.add.zone(validDropZone.x, validDropZone.y * .9,
			validDropZone.width, validDropZone.heigth);
	z1.name = name - 1;
	z1.idx = validDropZone.idx;
	validDropZones.push(z1);
}

function buildLowerZone(game, validDropZone, name) {
	var z2 = game.add.zone(validDropZone.x, validDropZone.y * 1.07,
			validDropZone.width, validDropZone.heigth);
	z2.name = name + 1;
	z2.idx = validDropZone.idx;
	validDropZones.push(z2);
}

function displayCardToTable(cardValue, colIndex) {
	var validDropZone;
	for (var i = 0; i < validDropZones.length; i++) {
		var overlapping = true;
		var isNameSame = false;
		var isIdxMatch = false;
		if (validDropZones[i].name == cardValue) {
			isNameSame = true;
		}
		if (validDropZones[i].idx == colIndex) {
			isIdxMatch = true;
		}
		if (overlapping
				&& isIdxMatch
				&& (isNameSame || (validDropZones[i].name == 'init' && isSatti(cardValue)))) {
			validDropZone = validDropZones[i];
		}
	}
	if (validDropZone) {
		var image = this.game.add.image(validDropZone.x, validDropZone.y,
				'card_' + cardValue).setOrigin(0.5);
		image.name = cardValue;
		game.children.bringToTop(image);
		rmByVal(validDropZones, validDropZone);
		if (validDropZone.name == 'init') {
			buildUpperZone(game, validDropZone, cardValue);
			buildLowerZone(game, validDropZone, cardValue);
		} else if (validDropZone.name % 13 < 7 && validDropZone.name % 13 != 1) {
			buildUpperZone(game, validDropZone, cardValue);
		} else if (validDropZone.name % 13 != 0) {
			buildLowerZone(game, validDropZone, cardValue);
		}
		image.disableInteractive();
	}
}

function makeMyCardsInteractive(interactive) {
	selfCardsImages.forEach(myFunction);
	function myFunction(item, index) {
		if (interactive) {
			item.setInteractive();
			this.game.input.setDraggable(item);
		} else {
			item.disableInteractive();
		}
	}
	if (interactive) {
		adjustVisibilityOfBulb(myPosition, true);
		imgPass.setInteractive();
	} else {
		adjustVisibilityOfBulb(myPosition, false);
		imgPass.disableInteractive();
	}
}

function adjustVisibilityOfBulb(position, visibility) {
	console.log(position + ":" + visibility);
	if (position > 3) {
		bulbOrder[position % 4].visible = visibility;
	} else {
		bulbOrder[position].visible = visibility;
	}

}

function getUrlParameter(name) {
	name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
	var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
	var results = regex.exec(location.search);
	return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g,
			' '));
};

