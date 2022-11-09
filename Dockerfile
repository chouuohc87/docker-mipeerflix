FROM alpine:latest

WORKDIR /app
ADD . /app
RUN apk --update --no-cache add bash bash-completion build-base nodejs npm curl

ENTRYPOINT /bin/bash entrypoint.sh
