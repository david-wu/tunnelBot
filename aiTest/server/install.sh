#!/usr/bin/env bash


# init
apt-get update


# Docker
curl -sSL https://get.docker.com | sudo sh;


# install node, mongo
apt-get install -y nodejs
apt-get install postgresql postgresql-contrib

