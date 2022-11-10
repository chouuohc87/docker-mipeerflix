const fs = require("fs");
var http = require("http");
const superagent = require("superagent");
const logNetworkTime = require("superagent-node-http-timings");
const servers = {
  nl: ["185.52.0.68"],
  us: [
    "23.226.231.112",
    "168.235.78.99",
    "192.210.229.206",
    "168.235.81.120",
    "192.73.235.56"
  ]
};
function downloadSpeed(
  country = "us",
  server = servers[country][
    Math.floor(Math.random() * servers[country].length)
  ],
  uploadSpeed = false
) {
  return new Promise(async function (resolve) {
    try {
      if (!uploadSpeed) {
        console.log(`Using ${server}!`);
      }
      let response = await superagent
        .get(`http://${server}/100mb.test`)
        .use(
          logNetworkTime(function (err, result) {
            if (!err && result.status === 200) {
              let speed = (100 / result.timings.total) * 1000;
              console.log("downloadSpeed:", speed);
              resolve(speed);
            }
          })
        )
        .responseType("arraybuffer");
      try {
        let stats = await fs.promises.stat("100mb.test");
        if (stats.size !== 104857600) {
          await fs.promises.writeFile("100mb.test", response.body);
        }
      } catch (err) {
        await fs.promises.writeFile("100mb.test", response.body);
      }
    } catch (err) {
      resolve(downloadSpeed(country, server));
    }
  });
}
function uploadSpeed(
  country = "us",
  server = servers[country][Math.floor(Math.random() * servers[country].length)]
) {
  return new Promise(async function (resolve) {
    try {
      console.log(`Using ${server}!`);
      try {
        let stats = await fs.promises.stat("100mb.test");
        if (stats.size !== 104857600) {
          await downloadSpeed(country, server, true);
        }
      } catch (err) {
        await downloadSpeed(country, server, true);
      }
      await superagent
        .post(`http://${server}/webtests/ul.php`)
        .attach("file", "./100mb.test")
        .use(
          logNetworkTime(function (err, result) {
            if (!err && result.status === 200) {
              let speed = (100 / result.timings.total) * 1000;
              console.log("uploadSpeed:", speed);
              resolve(speed);
            }
          })
        );
    } catch (err) {
      resolve(uploadSpeed(country, server));
    }
  });
}
http
  .createServer(async function (req, res) {
    if (req.url === "/") {
      res.end("Hello World!");
    } else if (req.url === "/downloadSpeed") {
      let speed = await downloadSpeed("nl");
      res.end(`downloadSpeed: ${speed}`);
    } else if (req.url === "/uploadSpeed") {
      let speed = await uploadSpeed("nl");
      res.end(`uploadSpeed: ${speed}`);
    } else {
      res.end();
    }
  })
  .listen(3000);
