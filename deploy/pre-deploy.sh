#!/bin/bash

DEPLOY_BRANCH="main"
PROJECT_DIRECTORY="../"
DEPLOY_DIRECTORY="./deploy/"

cd $PROJECT_DIRECTORY

git checkout $DEPLOY_BRANCH

npm install -f

npm run build

tar -czf /tmp/dist.tar.gz ./dist

mkdir ./transfer

mv /tmp/dist.tar.gz ./transfer/

mv $DEPLOY_DIRECTORY ./transfer/
