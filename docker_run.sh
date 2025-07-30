docker stop bott
docker rm bott
docker run --name bott --restart always --privileged -it -d -e TZ="Europe/Moscow" -v /root/bott:/opt/app -w /opt/app ts-ready:latest ts-node ./src/index.ts
docker logs -f bott
