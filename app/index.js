const cors = require("cors");
const compression = require("compression");
const express = require("express");
const http = require("http");
const pty = require("node-pty");
const WebSocket = require("ws");
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.WebSocketServer({
	noServer: true,
	path: "/terminal"
});
server.on("upgrade", function(request, socket, head) {
	wss.handleUpgrade(request, socket, head, function(ws) {
		wss.emit("connection", ws, request);
	});
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
app.use(compression());
app.use(cors());
app.get("/", function(_, res) {
	res.send("Hello world!");
});
app.get("/ip", function(_, res) {
	http.get({
		host: "api.ipify.org",
		port: 80,
		path: "/"
	}, function(resp) {
		let html = "";
		resp.on("data", function(data) {
			html += data
		});
		resp.on("end", function() {
			res.send(html);
		});
	}).on("error", function(err) {
		res.send(err.toString());
	});
});
app.get("/favicon.ico", function(_, res) {
	let img = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAz1BMVEVMaXHyM0z2M0zuM0z3M0z3M0xFOkZtN0HqM0w0O0W/NUqRNkelNEevNUlzNkWHN0jsM0zlM0xoN0RZOUbuM0zuM0zoM0zlM0zoM0znM0zqM0yGLz/rM0zmM0zpM0zrM0zpM0vlM0zlM0zmM0zlM0vqM0zlM0s0O0UlKzM3O0XwM0wyO0U1O0XYNEv/M037MkwuO0UoKzMmPEQqO0XrM0zUM0r1M0zuM0wfKzMaKjExN0HMM0nDNUq7MEUqLzg8O0U4LTZMLDcwKzR6OEgmOUJ8qQmRAAAAQnRSTlMA7PrP2Nv+AQL+/v79/f79OCv9/tXWZRBw/ZX9tUqPtI0VFkhIlwn//////////////////////////////v///v4ZlqZfAAABpElEQVR4AY2ThdYiMQyFcXeXdeuUhvoUZ/X9n2nT9vwwyEpw7jc3mdOb3LWqtVquVyz2crVaNfekUP7wueBcYfEevz+Tv8zyIh0MUpGf1e6RKpq+Hot5t25MvTsXo4/hr2zz/ivnWhVNKGW60nLubf86CsrTNwXRGGpJCRaVetgQhXfTS5/aJC/WHWMokFBAjeysRX4SdH9rwjaphihHBDRtWuFvGZHxql3RjOKFANjDvwPxo7RXo2BRWkuJfwHT0hgAY6RmEPqsS37Majn1zUHS5rHRwe6NY5MigcgFqDNCGDlyJ3i3y53jDVbHf+pZgOqf3G7sBgs/eOcXfQBaIsgB4c0dwD3QzALLndrXbwAwQ7e5lPu+VWp/OySYNrcvBq2dSpJkfwuwr4fYxIqDSsIjzQIEZCQsP/zYeoN7AE+RNoS1/KRQfwagh2wL0d6i+x1wOWdmjqfdRY/A5bCiR+Xbi7/abiNwOe7oIc9RT3bfWqvRY2DwHQmldmo5D4F5Frkzug9SHiL3PLTb76dMaJ/GXmRj/2xxPvm//rF6/7u8/1z/3wj1a5KmJvR/AAAAAElFTkSuQmCC", "base64");
	res.writeHead(200, {
		"Content-Type": "image/png",
		"Content-Length": img.length
	});
	res.end(img);
});
app.get("/terminal", function(req, res) {
	res.send(`<!DOCTYPE html> <html> <head> <title>Terminal</title> <link href="https://cdn.jsdelivr.net/npm/xterm/css/xterm.css" rel="stylesheet"> <style> html, .terminal { height: 100%; } body, #terminal { height: 100%; margin: 0; } </style> <script src="https://cdn.jsdelivr.net/npm/xterm/lib/xterm.min.js"></script> <script src="https://cdn.jsdelivr.net/npm/xterm-addon-fit/lib/xterm-addon-fit.min.js"></script> <script src="https://cdn.jsdelivr.net/npm/xterm-addon-webgl/lib/xterm-addon-webgl.min.js"></script> </head> <body> <div id="terminal"></div> <script type="text/javascript"> (function connect() { if ("WebSocket" in window) { const el = document.getElementById("terminal"); el.innerHTML = ""; const ws = new WebSocket("wss://" + window.location.host + "/terminal"); const terminal = new Terminal({ allowProposedApi: true, scrollback: 1000, tabStopWidth: 4, fontFamily: "Menlo, Consolas, Liberation Mono, Monaco, Lucida Console, monospace" }); terminal.open(el); terminal.focus(); const fitAddon = new FitAddon.FitAddon(); const webglAddon = new WebglAddon.WebglAddon(); terminal.loadAddon(webglAddon); terminal.loadAddon(fitAddon); terminal.onResize(function(size) { ws.send(JSON.stringify({ "type": "resize", "payload": size })); }); terminal.onData(function(data) { ws.send(JSON.stringify({ "type": "data", "payload": data })); }); ws.onopen = function() { fitAddon.fit(); }; ws.onmessage = function(e) { try { var data = JSON.parse(e.data); if (data.type === "data") { terminal.write(data.payload); } else if (data.type === "exit") { terminal.writeln("Terminal disconnected!"); } } catch (err) { console.log("ws.onmessage", err); } }; ws.onclose = function() { terminal.writeln("Terminal reconnecting..."); setTimeout(connect, 2000); }; window.onresize = function() { fitAddon.fit(); }; window.onbeforeunload = function() { if (ws.readyState === ws.OPEN) { ws.close(); } }; } else { alert("WebSocket is NOT supported by your browser!"); } })(); </script> </body> </html>`);
});
server.listen(3000, async function() {
	console.log("Running at Port 3000");
});
