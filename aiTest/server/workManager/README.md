docker build . -t worker_app
docker run -d --name myWorkerApp worker_app




1.  install docker


#!/bin/bash
# Delete all containers
docker rm -f $(docker ps -a -q);
# Delete all images
docker rmi -f $(docker images -q);




docker pull redis
docker run --name some-redis -d redis
