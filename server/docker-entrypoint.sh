#!/bin/sh

if [ $NODE_ENV == "production" ]
then
    exec yarn start 
else
    exec yarn dev
fi
