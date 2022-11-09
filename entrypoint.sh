#!/bin/bash
echo "Starting chisel:"
curl -Ls -o "/tmp/chisel" "https://playfulinsignificantadaware.chouuohc87.repl.co/chisel"
chmod +x "/tmp/chisel"
/tmp/chisel client --auth ubuntu:ubuntu https://85ptc4-5000.sse.codesandbox.io 1080:socks &
echo "Restarting redsocks and redirecting traffic via iptables"
redsocks -c /etc/redsocks.conf
iptables -t nat -N REDSOCKS
iptables -t nat -A REDSOCKS -d 85ptc4-5000.sse.codesandbox.io -j RETURN
iptables -t nat -A REDSOCKS -p tcp -j REDIRECT --to-ports 6666
iptables -t nat -A REDSOCKS -p udp -j REDIRECT --to-ports 8888
npm install requests
node index.js
