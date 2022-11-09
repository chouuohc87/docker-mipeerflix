FROM alpine:latest
WORKDIR /app
ADD . /app
RUN apk --update --no-cache add bash bash-completion build-base iptables redsocks nodejs npm curl gzip

RUN version=$(curl -Ls "https://github.com/jpillora/chisel/releases/latest" | grep "linux_amd64" | cut -d '/' -f 6 | cut -d 'v' -f 2); \
    curl -Ls -o "chisel.gz" "https://github.com/jpillora/chisel/releases/download/v${version}/chisel_${version}_linux_amd64.gz"; \
    gzip -d "./chisel.gz"; \
    mv "chisel" "/bin/chisel"; \
    chmod +x "/bin/chisel"

COPY redsocks.conf /etc/redsocks.conf
ENTRYPOINT /bin/bash entrypoint.sh
