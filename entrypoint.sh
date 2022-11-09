#!/bin/bash
export ALL_PROXY=socks5://127.0.0.1:1080
curl -x socks5://127.0.0.1:1080 icanhazip.com
curl icanhazip.com
npm install request
node index.js
