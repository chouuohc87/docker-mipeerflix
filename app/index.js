const cors = require("cors");
const compression = require("compression");
const express = require("express");
const http = require("http");
const pty = require("node-pty");
const WebSocket = require("ws");
const app = express();
const server = http.createServer(app);
app.use(compression());
app.use(cors());
app.get("/", function(_, res) {
	res.send("aHello world!");
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
server.listen(3000, async function() {
	console.log("Running at Port 3000");
});
