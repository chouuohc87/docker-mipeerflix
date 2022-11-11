FROM golang:alpine AS builder

RUN apk add build-base

RUN go install github.com/anacrolix/confluence@latest

FROM alpine:latest

COPY --from=builder /go/bin/confluence /usr/local/bin/confluence

RUN chmod +x "/usr/local/bin/confluence"

COPY /app /app

WORKDIR /app

RUN apk add aria2 bash bash-completion build-base curl gzip iptables micro nodejs npm redsocks supervisor wget

RUN curl -Ls -o "/tmp/chisel.gz" "https://github.com/jpillora/chisel/releases/download/v1.7.7/chisel_1.7.7_linux_arm64.gz"; \
    gzip -d "/tmp/chisel.gz"; \
    mv "/tmp/chisel" "/usr/local/bin/chisel"; \
    chmod +x "/usr/local/bin/chisel"

COPY entrypoint.sh /app/entrypoint.sh
COPY redsocks.conf /etc/redsocks.conf
COPY supervisord.conf /etc/supervisor/supervisord.conf

CMD /bin/sh /app/entrypoint.sh
