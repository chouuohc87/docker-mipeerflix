FROM alpine:latest

COPY /app /app

WORKDIR /app

RUN apk --update --no-cache add bash bash-completion build-base curl gzip iptables micro nodejs npm redsocks supervisor wget

RUN curl -Ls -o "/tmp/chisel.gz" "https://github.com/jpillora/chisel/releases/download/v1.7.7/chisel_1.7.7_linux_arm64.gz"; \
    gzip -d "/tmp/chisel.gz"; \
    mv "/tmp/chisel" "/bin/chisel"; \
    chmod +x "/bin/chisel"

COPY entrypoint.sh /app/entrypoint.sh
COPY redsocks.conf /etc/redsocks.conf
COPY supervisord.conf /etc/supervisor/supervisord.conf

CMD /bin/sh /app/entrypoint.sh
