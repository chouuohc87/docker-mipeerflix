#!/bin/bash
curl -x socks5://127.0.0.1:1080 icanhazip.com
curl icanhazip.com
npm install request
node index.js
