#!/usr/bin/env bash


# init
sudo apt-get update;


# Docker
curl -sSL https://get.docker.com | sudo sh;


# install node, postgres
sudo apt-get install -y nodejs nodejs-legacy npm;
sudo apt-get install -y npm;


sudo apt-get install -y postgresql postgresql-contrib;
sudo -u postgres -i;
psql postgres -c "CREATE DATABASE code_together";
su - root;

# psql
# CREATE DATABASE code_together


git clone https://github.com/david-wu/tunnelBot.git;

cd ~/tunnelBot/aiTest/server;
npm install;

cd ~/tunnelBot/aiTest/my-app;
npm install;

