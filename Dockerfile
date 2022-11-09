FROM alpine:latest
WORKDIR /app
ADD . /app
RUN apk --update --no-cache add bash bash-completion build-base iptables redsocks nodejs npm curl

COPY redsocks.conf /etc/redsocks.conf

ENTRYPOINT /bin/bash entrypoint.sh
