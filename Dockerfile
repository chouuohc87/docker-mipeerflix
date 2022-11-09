FROM alpine:latest
WORKDIR /app
ADD . /app
ENV PROXY_SERVER=localhost
ENV PROXY_PORT=3128
RUN apk --update --no-cache add bash bash-completion build-base iptables redsocks nodejs npm curl
COPY redsocks.conf /etc/redsocks.conf
ENTRYPOINT /bin/bash entrypoint.sh
