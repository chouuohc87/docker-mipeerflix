#!/bin/bash
npm install request
echo "Starting chisel"
chisel client --auth ubuntu:ubuntu https://85ptc4-5000.sse.codesandbox.io 1080:socks &
sleep 10
echo "Restarting redsocks and redirecting traffic via iptables"
redsocks -v -c /etc/redsocks.conf
iptables -t nat -N REDSOCKS
iptables -t nat -A REDSOCKS -d 85ptc4-5000.sse.codesandbox.io -j RETURN
iptables -t nat -A REDSOCKS -d 0.0.0.0/8 -j RETURN
iptables -t nat -A REDSOCKS -d 10.0.0.0/8 -j RETURN
iptables -t nat -A REDSOCKS -d 100.64.0.0/10 -j RETURN
iptables -t nat -A REDSOCKS -d 127.0.0.0/8 -j RETURN
iptables -t nat -A REDSOCKS -d 169.254.0.0/16 -j RETURN
iptables -t nat -A REDSOCKS -d 172.16.0.0/12 -j RETURN
iptables -t nat -A REDSOCKS -d 192.168.0.0/16 -j RETURN
iptables -t nat -A REDSOCKS -d 198.18.0.0/15 -j RETURN
iptables -t nat -A REDSOCKS -d 224.0.0.0/4 -j RETURN
iptables -t nat -A REDSOCKS -d 240.0.0.0/4 -j RETURN
iptables -t nat -A REDSOCKS -p tcp -j REDIRECT --to-ports 6666
iptables -t nat -A REDSOCKS -p udp -j REDIRECT --to-ports 8888
iptables -t nat -A OUTPUT -p tcp -m owner --uid-owner root -j REDSOCKS
sleep 10
echo "curl with socks"
curl -x socks5://127.0.0.1:1080 ifconfig.me
echo "curl without socks"
curl ifconfig.me
node index.js
sleep 10
