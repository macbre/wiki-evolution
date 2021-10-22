# https://hub.docker.com/_/node?tab=tags&page=1&name=slim
FROM node:slim

RUN apt-get update && \
	apt-get install -y gource ffmpeg xvfb

WORKDIR /opt/wiki-evolution

COPY package.json .
COPY package-lock.json .
RUN npm ci

# these two are passed as build args
ARG BUILD_DATE
ARG GITHUB_SHA
ENV BUILD_DATE=$BUILD_DATE
ENV GITHUB_SHA=$GITHUB_SHA

COPY . .
USER nobody
