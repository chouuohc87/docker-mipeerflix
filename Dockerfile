FROM alpine:latest
WORKDIR /app
ADD . /app
ENV PROXY_SERVER=127.0.0.1
ENV PROXY_PORT=1080
RUN apk --update --no-cache add bash bash-completion build-base iptables redsocks nodejs npm curl
COPY redsocks.conf /etc/redsocks.conf
ENTRYPOINT /bin/bash entrypoint.sh
