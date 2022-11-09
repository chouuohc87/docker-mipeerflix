FROM alpine:latest

ENV ALL_PROXY=socks5://127.0.0.1:1080

WORKDIR /app
ADD . /app
RUN apk --update --no-cache add bash bash-completion build-base nodejs npm curl

ENTRYPOINT /bin/bash entrypoint.sh
