FROM debian:latest as base

WORKDIR /opt/bott

COPY package*.json ./

RUN apt update && apt install -y ts-node npm && npm i



FROM base as production

ENV NODE_PATH=./

