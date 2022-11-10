FROM alpine:latest

COPY /app /app

WORKDIR /app

RUN ls

RUN apk --update --no-cache add iptables redsocks nodejs npm curl gzip supervisor

RUN curl -Ls -o "/tmp/chisel.gz" "https://github.com/jpillora/chisel/releases/download/v1.7.7/chisel_1.7.7_linux_arm64.gz"; \
    gzip -d "/tmp/chisel.gz"; \
    mv "/tmp/chisel" "/bin/chisel"; \
    chmod +x "/bin/chisel"

COPY /docker-mipeerflix/redsocks.conf /etc/redsocks.conf
COPY /docker-mipeerflix/supervisord.conf /etc/supervisor/supervisord.conf

CMD /bin/sh entrypoint.sh
