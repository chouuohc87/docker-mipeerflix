FROM alpine:latest

ENV HTTP_PROXY=socks5h://127.0.0.1:1080
ENV HTTPS_PROXY=socks5h://127.0.0.1:1080

WORKDIR /app
ADD . /app
RUN apk --update --no-cache add bash bash-completion build-base iptables redsocks nodejs npm curl

COPY redsocks.conf /etc/redsocks.conf

ENTRYPOINT /bin/bash entrypoint.sh
