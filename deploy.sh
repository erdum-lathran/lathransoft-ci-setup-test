#!/bin/bash

DEPLOY_BRANCH="main"
PROJECT_DIRECTORY="./"
DEPLOY_DIRECTORY="./deploy"
DEPLOY_SCRIPT="deploy.php"
SERVER_DIR="/deploy"

git checkout $DEPLOY_BRANCH

cd $PROJECT_DIRECTORY

npm install -f

mkdir -p $DEPLOY_DIRECTORY

mv $DEPLOY_SCRIPT $DEPLOY_DIRECTORY

tar --exclude='.deploy/' -czf $DEPLOY_DIRECTORY/project.tar.gz ./*
