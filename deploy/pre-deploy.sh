#!/bin/bash
set -euo pipefail

DEPLOY_BRANCH="main"
DEPLOY_DIRECTORY="./deploy/"

git checkout $DEPLOY_BRANCH

npm ci

npm run build

tar -czf /tmp/dist.tar.gz -C ./dist .

mkdir ./transfer

mv /tmp/dist.tar.gz ./transfer/

mv $DEPLOY_DIRECTORY ./transfer/
