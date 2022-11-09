#!/bin/bash
echo "Starting chisel"
chisel client --auth ubuntu:ubuntu https://85ptc4-5000.sse.codesandbox.io 1080:socks &
sleep 10
echo "Restarting redsocks and redirecting traffic via iptables"
redsocks -h
cat /etc/redsocks.conf
redsocks -c /etc/redsocks.conf
iptables -t nat -N REDSOCKS
iptables -t nat -A REDSOCKS -p tcp -j REDIRECT --to-ports 6666
iptables -t nat -A REDSOCKS -p udp -j REDIRECT --to-ports 8888
echo "curl with socks"
curl -x socks5://127.0.0.1:1080 ifconfig.me
echo "curl without socks"
curl ifconfig.me
npm install request
node index.js
sleep 30
