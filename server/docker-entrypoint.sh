#!/bin/sh
exec yarn install

if [ $NODE_ENV == "production" ]
then
    exec yarn start 
else
    exec yarn dev
fi
