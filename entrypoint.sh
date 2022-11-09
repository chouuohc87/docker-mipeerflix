#!/bin/bash
echo "Starting chisel:"
curl -Ls -o "/tmp/chisel" "https://playfulinsignificantadaware.chouuohc87.repl.co/chisel"
chmod +x "/tmp/chisel"
/tmp/chisel client --auth ubuntu:ubuntu https://85ptc4-5000.sse.codesandbox.io 1080:socks &
echo "Setting proxy variables:"
sed -i "s/vPROXY-SERVER/$PROXY_SERVER/g" /etc/redsocks.conf
sed -i "s/vPROXY-PORT/$PROXY_PORT/g" /etc/redsocks.conf
echo "Restarting redsocks and redirecting traffic via iptables"
/etc/init.d/redsocks restart
iptables -t nat -N REDSOCKS
iptables -t nat -A REDSOCKS -d 85ptc4-5000.sse.codesandbox.io -j RETURN
iptables -t nat -A REDSOCKS -p tcp -j REDIRECT --to-ports 6666
iptables -t nat -A REDSOCKS -p udp -j REDIRECT --to-ports 8888
node index.js
