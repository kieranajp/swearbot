FROM mhart/alpine-node:6.4

RUN apk --update add sqlite && rm -rf /var/cache/apk/*
COPY config.js.dist config.dist

