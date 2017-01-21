docker build . -t worker_app
docker run -d --name myWorkerApp worker_app


#!/bin/bash
# Delete all containers
docker rm -f $(docker ps -a -q)
# Delete all images
docker rmi $(docker images -q)