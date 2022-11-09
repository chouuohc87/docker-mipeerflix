FROM alpine:latest
WORKDIR /app
ADD . /app
RUN apk --update --no-cache add bash bash-completion build-base iptables redsocks nodejs npm curl gzip

RUN curl -Ls -o "chisel.gz" "https://github.com/jpillora/chisel/releases/download/v1.7.7/chisel_1.7.7_linux_arm64.gz"; \
    gzip -d "./chisel.gz"; \
    mv "chisel" "/bin/chisel"; \
    chmod +x "/bin/chisel"

COPY redsocks.conf /etc/redsocks.conf

ENTRYPOINT /bin/bash entrypoint.sh
