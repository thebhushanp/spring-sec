var dX, dY;
var config = {
	    type: Phaser.AUTO,
	    parent: 'phaser-example',
	    width: window.innerWidth,
	    height: window.innerHeight,
	    autoResize: true,
	    // width : 2200,
	    // height : 1800,
	    physics: {
	        default: 'arcade',
	        arcade: {
	            gravity: {
	                y: 200
	            },
	        }
	    },
	    scene: {
	        preload: preload,
	        create: create
	    }
	};
var winW = window.innerWidth;
var winH = window.innerHeight;
var game = new Phaser.Game(config);

wsendpoint = null;
var stompClient = null;
var revision = 0;
var phPlyName1, phPlyName2, phPlyName3, phPlyMe;
var phPlyImg1, phPlyImg2, phPlyImg3, phPlyImg4;
var displayName;
var dragStrX, dragStrY;
var validDropPoints = [];

function preload() {
    this.load.path = "../images/";
    this.load.image('sky', 'canvas/user.png');
    this.load.image('card_face', 'cards/back.gif');
    loadCards(this);
}

function create() {
    this.cameras.main.backgroundColor.setTo(143, 244, 66);
    
    renderPics(this);

    renderUserNames(this);

    renderInitDropPts(this);

    sockInit(this);

    dragEvents(this);
    
    //this.events.on('resize', resize, this);
}

function renderPics(game) {
    phPlyImg1 = game.add.image(winW * .05, winH / 2, 'sky').setScale(.25);
    phPlyImg2 = game.add.image(winW / 2, winH * .07, 'sky').setScale(.25);
    phPlyImg3 = game.add.image(winW * .95, winH / 2, 'sky').setScale(.25);
    phPlyImg4 = game.add.image(winW / 2, winH * .93, 'sky').setScale(.25);
}

function renderUserNames(game) {
     phPlyName1 = game.add.text(winW * .02, winH / 2.5, 'Player 1', {
     fontSize : '32px',
     fill : '#000'
     });
     phPlyName2 = game.add.text(winW * .3, winH *.05, 'Player 2', {
     fontSize : '32px',
     fill : '#000'
     });
     phPlyName3 = game.add.text(winW * .9, winH / 2.5, 'Player 3', {
     fontSize : '32px',
     fill : '#000'
     });
     phPlyMe = game.add.text(winW * .3, winH *.9, displayName, {
     fontSize : '32px',
     fill : '#000'
     });
    	
}

function renderInitDropPts(game) {
    var dropzone1 = game.add.graphics();
    dropzone1.lineStyle(2, 0xffff00, 1);
    dropzone1.strokeRoundedRect((winW * .4) - 20, (winH / 2.25)-25, 40, 50, 4);
    var z1 = game.add.zone((winW * .4), (winH / 2.25), 40, 50);
    z1.name = 7;
    validDropPoints[0] = z1;
    
    var dropzone2 = game.add.graphics();
    dropzone2.lineStyle(2, 0xffff00, 1);
    dropzone2.strokeRoundedRect(winW * .47 - 20, winH / 2.25 - 25, 40, 50, 4);
    var z2 = game.add.zone(winW * .47, winH / 2.25, 40, 50);
    z2.name=7;
    validDropPoints[1] = z2;
    
    dropzone3 = game.add.graphics();
    dropzone3.lineStyle(2, 0xffff00, 1);
    dropzone3.strokeRoundedRect(winW * .53 - 20, winH / 2.25 - 25, 40, 50, 4);
    var z3 = game.add.zone(winW * .53, winH / 2.25 , 40, 50);
    z3.name = 7;
    validDropPoints[2] = z3;
        
    var dropzone4 = game.add.graphics();
    dropzone4.lineStyle(2, 0xffff00, 1);
    dropzone4.strokeRoundedRect(winW * .6 - 20, winH / 2.25 - 25, 40, 50, 4);
    var z4 = game.add.zone(winW * .6, winH / 2.25, 40, 50);
    z4.name = 7;
    validDropPoints[3] = z4;
}

function sockInit(game) {
    var socket = new SockJS('/badam7');
    stompClient = Stomp.over(socket);
    wsendpoint = getUrlParameter("id");
    stompClient.connect({}, function(frame) {
        stompClient.subscribe('/geb/' + wsendpoint, function(messageOutput) {
            onReceive(JSON.parse(messageOutput.body), game);
        });
    });
}

function dragEvents(game) {
	game.input.on('drag', function(pointer, gameObject, dragX, dragY) {
        gameObject.x = dragX;
        gameObject.y = dragY;
    });
	game.input.on('dragstart', function(pointer, gameObject) {
        dragStrX = gameObject.x;
        dragStrY = gameObject.y;
        console.log("DS " + gameObject.x + ":" + gameObject.y)
        game.children.bringToTop(gameObject);
    }, game);

	game.input.on('dragend', function(pointer, gameObject, dragX, dragY) {
        var cardBounds = gameObject.getBounds();
        var validPosition;
        for (var i = 0; i < validDropPoints.length; i++) {
        	debugger;
            if (Phaser.Geom.Intersects.RectangleToRectangle(cardBounds,
                    validDropPoints[i].getBounds()) && validDropPoints[i].name == (gameObject.name % 13)
                    && (validDropPoints[i].name == 7 || validDropPoints[i].t == gameObject.t)) {
                validPosition = validDropPoints[i];
                validPosition.t = gameObject.t;
            }
        }
        if (validPosition) {
        	rmByVal(validDropPoints, validPosition);
        	if(validPosition.name == 7) {
        		var z1 = game.add.zone(validPosition.x, validPosition.y * .9, validPosition.width, validPosition.heigth);
                z1.name=6;
                z1.t=validPosition.t;
                var z2 = game.add.zone(validPosition.x, validPosition.y * 1.07, validPosition.width, validPosition.heigth);
                z2.name=8;
                z2.t=validPosition.t;
                validDropPoints.push(z1);
                validDropPoints.push(z2);
        	} else if (validPosition.name < 7) {
        		var z1 = game.add.zone(validPosition.x, validPosition.y * .9, validPosition.width, validPosition.heigth);
                z1.name=validPosition.name -1;
                z1.t=validPosition.t;
                validDropPoints.push(z1);
        	} else {
        		var z1 = game.add.zone(validPosition.x, validPosition.y * 1.07, validPosition.width, validPosition.heigth);
                z1.name=validPosition.name + 1;
                z1.t=validPosition.t;
                validDropPoints.push(z1);
        	}
        	// var z2 = game.add.zone(winW * .47, winH / 2.25, 40, 50);
            // z2.name=7;
        	// addToArr(validDropPoints, x);
            gameObject.x = validPosition.x;
            gameObject.y = validPosition.y;
        } else {
            gameObject.x = dragStrX;
            gameObject.y = dragStrY;
        }
        console.log("DE " + gameObject.x + ":" + gameObject.y)
    });
}

function loadCards(gameIns) {
    for (var i = 1; i < 53; i++) {
        gameIns.load.image('card_' + i, 'cards/' + i + '.gif');
    }
}

// websocket related code
function disconnect() {
    if (stompClient != null) {
        stompClient.disconnect();
    }
    wsendpoint = getUrlParameter("ws");
}

function onpageload() {
    var span = document.getElementsByClassName("username");
    displayName = localStorage.getItem('username');
    span[0].innerText = "Welcome " + displayName;
    disconnect();
}

function sendMessage() {
    var text = 'dummy_data';
    stompClient.send("/app/geb/" + wsendpoint, {}, JSON.stringify({
        'revision': revision++,
        'data': {
            'text': text
        }
    }));
}

function onReceive(msg, game) {
    if (msg.type == 'GAME_START') {
        dealCards(msg, game);
    }
    console.log('message output from ws' + msg);
}

function dealCards(msg, game) {
    playerOrder = msg.data.p_order;
    var myPosition;
    Object.keys(playerOrder).forEach(function(key, index) {
        if (playerOrder[key] == displayName) {
            myPosition = key;
        }
    });
    myPosition++;
    // set name to next player
    var next = playerOrder[(myPosition++) % 4];
    phPlyName1.setText(next);
    // set name to next's next player
    var nextNext = playerOrder[(myPosition++) % 4];
    phPlyName2.setText(nextNext);
    // set name to last player
    var last = playerOrder[(myPosition++) % 4];
    phPlyName3.setText(last);
    var cards = msg.data.cards;
    for (var i = 0; i < cards.length; i++) {
    	 var image = game.add.image((winW * 0.2) + i * 80, winH * .8, 'card_' + cards[i])
		 	.setOrigin(0.5).setInteractive();
		 game.input.setDraggable(image);
		 image.name = cards[i];
		 image.t = 'h';

    	
//        var image = game.add.image(20 + i * 80, 570, 'card_' + cards[i])
//            .setInteractive();
//        image.name = cards[i];
//        game.input.setDraggable(image);
    }
    renderOthersCard(game);
}

function renderOthersCard(gameThis) {
    // 2nd player
    var counter = 1;
    for (var i = 14; i < 27; i++) {
        var image = gameThis.add.image(120, 305 + counter * 5, 'card_face')
            .setScale(.63);
        counter++;
    }
    counter = 1;
    // 3rd player
    for (var i = 40; i < 53; i++) {
        var image = gameThis.add.image(450 + (i - 40) * 10, 128, 'card_face')
            .setOrigin(0, 0).setScale(.63);
    }
    // 4th player
    for (var i = 27; i < 40; i++) {
        var image = gameThis.add.image(985, 291 + counter * 5, 'card_face')
            .setOrigin(0, 0).setScale(.63);
        counter++;
    }
}

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g,
        ' '));
};