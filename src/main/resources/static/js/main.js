function doAuth() {
	var userName = document.getElementById("txtUsername").value;
	var password = document.getElementById("txtPassword").value;
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4) {
			if (this.status == 200) {
				var loginResult = JSON.parse(this.responseText);
				localStorage.setItem('username', loginResult.username);
				window.location = "dashboard.html";
			} else {
				alert('wrong username or password');
				document.getElementById("txtUsername").value = '';
				document.getElementById("txtPassword").value = '';
			}
		}
	};
	xmlhttp.open("POST", "/login");
	xmlhttp.setRequestHeader('Content-type',
			'application/x-www-form-urlencoded');
	xmlhttp.send('username=' + userName + '&password=' + password);
}

function createGame() {
	var maxPlayers = document.getElementById("txtMaxPlayers").value;
	var startTime = document.getElementById("txtST").value;
	var timeSplit = startTime.split(':');
	var hours = timeSplit[0];
	var minutes = timeSplit[1];
	var now = new Date();
	now.setHours(hours);
	now.setMinutes(minutes);
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			window.location = "ws.html?ws=" + this.responseText;
		} else if (this.readyState == 4 && this.status == 401) {
			window.location = "/app/login.html";
		}
	};
	xmlhttp.open("POST", "/api/game");
	xmlhttp.setRequestHeader('Content-type',
			'application/x-www-form-urlencoded');
	xmlhttp.send('maxPlayers=' + maxPlayers + '&startTime=' + now.valueOf());
}

function joinGame() {
	var token = document.getElementById("txtToken").value;
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			window.location = "updategame.html";
		} else if (this.readyState == 4 && this.status == 401) {
			window.location = "/app/login.html";
		}
	};
	xmlhttp.open("POST", "/api/joingame");
	xmlhttp.setRequestHeader('Content-type',
			'application/x-www-form-urlencoded');
	xmlhttp.send('token=' + token);
}

function joinRandGame() {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var resJSON = JSON.parse(this.responseText);
			window.location = "responsive.html?id=" + resJSON.id;
		} else if (this.readyState == 4 && this.status == 401) {
			window.location = "/app/login.html";
		}
	};
	xmlhttp.open("GET", "/api/joinRandGame");
	xmlhttp.send();
}

function startGame() {
	var gameId = document.getElementById("gameId").value;
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			window.location = "updategame.html";
		} else if (this.readyState == 4 && this.status == 401) {
			window.location = "/app/login.html";
		}
	};
	xmlhttp.open("POST", "/api/game/start");
	xmlhttp.setRequestHeader('Content-type',
			'application/x-www-form-urlencoded');
	xmlhttp.send('gameId=' + gameId);
}

function dashboardOnLoad() {
	var span = document.getElementsByClassName("username");
	span[0].innerText = "Welcome " + localStorage.getItem('username');
}