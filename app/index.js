const http = require('http');
const httpProxy = require('http-proxy');
const pty = require('node-pty');
const WebSocket = require('ws');
const wss = new WebSocket.WebSocketServer({
	noServer: true
});
const aria2c = new httpProxy.createProxyServer({
	target: {
		host: '0.0.0.0',
		port: 6800
	}
});
const server = http.createServer(function(req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
	res.setHeader('Access-Control-Max-Age', 2592000);
	if (req.url == '/') {
		res.writeHead(200, {
			'Content-Type': 'text/plain'
		});
		res.end('Hello world!');
	} else if (req.url.startsWith('/jsonrpc')) {
		req.url = req.url.slice(8);
		aria2c.web(req, res);
	} else if (req.url == '/terminal') {
		res.end(`<!DOCTYPE html> <html> <head> <title>Terminal</title> <link href="https://cdn.jsdelivr.net/npm/xterm/css/xterm.css" rel="stylesheet"> <style> html, .terminal { height: 100%; } body, #terminal { height: 100%; margin: 0; } </style> <script src="https://cdn.jsdelivr.net/npm/xterm/lib/xterm.min.js"></script> <script src="https://cdn.jsdelivr.net/npm/xterm-addon-fit/lib/xterm-addon-fit.min.js"></script> <script src="https://cdn.jsdelivr.net/npm/xterm-addon-webgl/lib/xterm-addon-webgl.min.js"></script> </head> <body> <div id="terminal"></div> <script type="text/javascript"> (function connect() { if ("WebSocket" in window) { const el = document.getElementById("terminal"); el.innerHTML = ""; const ws = new WebSocket("wss://" + window.location.host + "/terminal"); const terminal = new Terminal({ allowProposedApi: true, scrollback: 1000, tabStopWidth: 4, fontFamily: "Menlo, Consolas, Liberation Mono, Monaco, Lucida Console, monospace" }); terminal.open(el); terminal.focus(); const fitAddon = new FitAddon.FitAddon(); const webglAddon = new WebglAddon.WebglAddon(); terminal.loadAddon(webglAddon); terminal.loadAddon(fitAddon); terminal.onResize(function(size) { ws.send(JSON.stringify({ "type": "resize", "payload": size })); }); terminal.onData(function(data) { ws.send(JSON.stringify({ "type": "data", "payload": data })); }); ws.onopen = function() { fitAddon.fit(); }; ws.onmessage = function(e) { try { var data = JSON.parse(e.data); if (data.type === "data") { terminal.write(data.payload); } else if (data.type === "exit") { terminal.writeln("Terminal disconnected!"); } } catch (err) { console.log("ws.onmessage", err); } }; ws.onclose = function() { terminal.writeln("Terminal reconnecting..."); setTimeout(connect, 2000); }; window.onresize = function() { fitAddon.fit(); }; window.onbeforeunload = function() { if (ws.readyState === ws.OPEN) { ws.close(); } }; } else { alert("WebSocket is NOT supported by your browser!"); } })(); </script> </body> </html>`);
	} else {
		res.writeHead(404, {
			'Content-Type': 'text/plain'
		});
		res.end('Not Found');
	}
});
server.on('upgrade', function(req, socket, head) {
	if (req.url == '/jsonrpc') {
		console.log("aria2c", "ws");
		aria2c.ws(req, socket, head);
	} else if (req.url == '/terminal') {
		wss.handleUpgrade(req, socket, head, function(ws) {
			wss.emit("connection", ws, req);
		});
	} else {
		socket.end();
	}
});
wss.on("connection", function(ws) {
	const term = pty.spawn("bash", [], {
		name: "xterm-color",
		cols: 30,
		rows: 80,
		cwd: process.env.HOME,
		env: process.env
	});
	console.log(`Created terminal with PID: ${ term.pid }`);
	term.on("data", function(data) {
		if (ws.readyState === ws.OPEN) {
			ws.send(JSON.stringify({
				type: "data",
				payload: data
			}));
		}
	});
	term.on("exit", function() {
		if (ws.readyState === ws.OPEN) {
			ws.send(JSON.stringify({
				type: "exit"
			}));
			ws.close();
		}
	});
	ws.on("message", function(message) {
		try {
			var data = JSON.parse(message);
			if (data.type === "data") {
				term.write(data.payload);
			} else if (data.type === "resize") {
				const cols = data.payload.cols || 80;
				const rows = data.payload.rows || 30;
				term.resize(cols, rows);
				console.log(`Resized terminal ${ term.pid } to ${ cols } cols and ${ rows } rows`);
			}
		} catch (err) {
			console.log("ws.onmessage", err);
		}
	});
	ws.on("close", function() {
		term.kill();
		console.log(`Closed terminal with PID: ${ term.pid }`);
	});
});
server.listen(3000);
