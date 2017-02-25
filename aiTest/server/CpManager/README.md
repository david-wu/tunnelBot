docker build . -t worker_app
docker run -d --name myWorkerApp worker_app


drop into docker instance
docker exec -i -t worker_0 /bin/bash



1.  install docker


#!/bin/bash

# Delete all containers
docker rm -f $(docker ps -a -q);

# Delete all images
docker rmi -f $(docker images -q);

# Delete worker image
docker rmi -f worker_image;

docker pull redis
docker run --name some-redis -d redis
