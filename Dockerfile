FROM alpine:latest

WORKDIR /app
ADD . /app

RUN apk --update --no-cache add iptables redsocks nodejs npm curl gzip supervisor

RUN curl -Ls -o "chisel.gz" "https://github.com/jpillora/chisel/releases/download/v1.7.7/chisel_1.7.7_linux_arm64.gz"; \
    gzip -d "./chisel.gz"; \
    mv "chisel" "/bin/chisel"; \
    chmod +x "/bin/chisel"

COPY redsocks.conf /etc/redsocks.conf
COPY supervisord.conf /etc/supervisor/supervisord.conf

ENTRYPOINT /bin/sh entrypoint.sh

CMD supervisord -c /etc/supervisor/supervisord.conf
