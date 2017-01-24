FROM node:boron

WORKDIR /workerApp

# Install programs
RUN apt-get update
RUN apt-get install -y nodejs
RUN apt-get install -y nodejs-legacy
RUN apt-get install -y npm

ADD . .
RUN npm install

CMD npm run start

EXPOSE 80