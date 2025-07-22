#!/bin/bash

DEPLOY_BRANCH="main"
DEPLOY_DIRECTORY="./deploy/"

git checkout $DEPLOY_BRANCH

npm install -f

npm run build

tar -czf /tmp/dist.tar.gz ./dist

mkdir ./transfer

mv /tmp/dist.tar.gz ./transfer/

mv $DEPLOY_DIRECTORY ./transfer/
