#!/bin/sh
npm install

if [ $NODE_ENV == "production" ]
then
    # https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md#cmd
    node app.js 
else
    npm run serve
fi
