FROM node:boron

WORKDIR /workerApp

RUN apt-get update


RUN apt-get install -y libstdc++6
RUN apt-get install -y gcc
RUN apt-get install -y g++
RUN apt-get install -y python3 python3-pip python3-dev python3-numpy
RUN apt-get install -y python-software-properties


RUN apt-get install -y nodejs
RUN apt-get install -y nodejs-legacy
RUN apt-get install -y npm

RUN apt-get install -y ruby
RUN apt-get install -y irb


ADD . .

RUN npm install

CMD npm run start

EXPOSE 80