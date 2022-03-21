#!/bin/sh
yarn install

if [ $NODE_ENV == "production" ]
then
    # https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md#cmd
    # yarn build
    # exec yarn start
    exec yarn start_alt 
else
    exec yarn dev
fi
