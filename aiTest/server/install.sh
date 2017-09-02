#!/usr/bin/env bash


# init
sudo apt-get update


# Docker
curl -sSL https://get.docker.com | sudo sh;


# install node, postgres
sudo apt-get install -y nodejs
sudo apt install nodejs-legacy
sudo apt-get install postgresql postgresql-contrib

# psql
# CREATE DATABASE code_together