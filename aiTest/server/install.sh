#!/usr/bin/env bash


# init
sudo apt-get update;


# Docker
curl -sSL https://get.docker.com | sudo sh;



sudo apt-get install -y postgresql postgresql-contrib;
sudo -u postgres -i;
psql postgres -c "CREATE USER root PASSWORD 'test'";
psql postgres -c "CREATE DATABASE code_together OWNER root";
su - root;

# psql
# CREATE DATABASE code_together



curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -;
sudo apt-get install -y nodejs;
sudo apt-get install -y build-essential;

# sudo apt-get install nodejs
# # install node, postgres
# sudo apt-get install -y nodejs nodejs-legacy npm;
# sudo apt-get install -y npm;

git clone https://github.com/david-wu/tunnelBot.git;

cd ~/tunnelBot/aiTest/server;
npm install;

cd ~/tunnelBot/aiTest/my-app;
npm install;
# npm run build;
