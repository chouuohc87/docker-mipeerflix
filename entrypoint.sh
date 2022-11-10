#!/bin/sh

echo $CHISEL_CLIENT_HOST

# Create new chain
iptables -t nat -N REDSOCKS

# Ignore Chisel traffic
iptables -t nat -A REDSOCKS -d $CHISEL_CLIENT_HOST -j RETURN

# Ignore LANs and some other reserved addresses.
iptables -t nat -A REDSOCKS -d 0.0.0.0/8 -j RETURN
iptables -t nat -A REDSOCKS -d 10.0.0.0/8 -j RETURN
iptables -t nat -A REDSOCKS -d 127.0.0.0/8 -j RETURN
iptables -t nat -A REDSOCKS -d 169.254.0.0/16 -j RETURN
iptables -t nat -A REDSOCKS -d 172.16.0.0/12 -j RETURN
iptables -t nat -A REDSOCKS -d 192.168.0.0/16 -j RETURN
iptables -t nat -A REDSOCKS -d 224.0.0.0/4 -j RETURN
iptables -t nat -A REDSOCKS -d 240.0.0.0/4 -j RETURN

# Anything else should be redirected to port 6666
iptables -t nat -A REDSOCKS -p tcp -j REDIRECT --to-ports 6666
iptables -t nat -A REDSOCKS -p udp -j REDIRECT --to-ports 8888

# Redirect all outgoing packets through Redsocks
iptables -t nat -A OUTPUT -j REDSOCKS

# Defining the following rules in the PREROUTING chain. For redirecting incomming packets to the REDSOCKS chain. 
iptables -t nat -A PREROUTING -j REDSOCKS
