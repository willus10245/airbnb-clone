#! /bin/bash

yarn build:server
docker build -t willus10245/airbnb-clone:latest .
docker push willus10245/airbnb-clone:latest
ssh root@206.189.176.234 "docker pull willus10245/airbnb-clone:latest && docker tag willus10245/airbnb-clone:latest dokku/airbnb-clone:latest && dokku tags:deploy airbnb-clone latest"