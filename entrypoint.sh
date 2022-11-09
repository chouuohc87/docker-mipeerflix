#!/bin/bash
curl -x socks5://0.0.0.0:1080 icanhazip.com
curl icanhazip.com
npm install request
node index.js
