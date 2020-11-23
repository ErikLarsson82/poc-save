
var fetching = false;
var logOutput = []
var hasTimeout = false;
var hasReturn = false;
var pingInterval


function save() {
	function reqListener () {
		logOutput.pop()
	  	logOutput.push({ msg: "Parameters saved on device", status: "✅" })
	  	renderLog()

	  	ping()
	  	pingInterval = setInterval(ping, 3000)
	}

	var oReq = new XMLHttpRequest();
	oReq.addEventListener("load", reqListener);
	oReq.open("GET", "data.xml");
	oReq.send();
}

function saveWrapper() {
	if (fetching === true) return 

	fetching = true

	logOutput.push({ msg: "Parameters saved on device", status: "..." })
	renderLog()

	setTimeout(save, 1000)
}

function renderLog() {
	var c = ""
	var m = logOutput

	for (var i = 0; i < m.length; i++) {
		c += "<p>" + m[i].msg + " " + m[i].status + time(m[i]) + "</p>"
	}

	document.getElementById("content").innerHTML = c
}

function time(str) {
	if (!str.ms) return ""
	return " (" + str.ms + "ms)"
}

function ping() {
	if (hasTimeout && hasReturn) {
		clearInterval(pingInterval)
		logOutput.push({ msg: "Device rebooted successfully", status: "✅" })
	  	renderLog()
		return
	}
	logOutput.push({ msg: "Ping device", status: "..." })
	renderLog()

	var now = new Date().getMilliseconds()

	var oReq = new XMLHttpRequest();
	oReq.timeout = 2500;
	oReq.onload = function() {
		if (hasTimeout) {
			hasReturn = true
		} 
		logOutput.pop()
		logOutput.push({ msg: "Ping device", status: "✅", ms: new Date().getMilliseconds() - now })
	  	renderLog()
	}
	oReq.onerror = function() {
		logOutput.pop()
		logOutput.push({ msg: "Ping device", status: "FAILED" })
	  	renderLog()
	}
	oReq.ontimeout = function() {
		hasTimeout = true

		logOutput.pop()
		logOutput.push({ msg: "Ping device", status: "TIMEOUT" })
	  	renderLog()
	}
	oReq.open("GET", "data.xml");
	oReq.send();
}