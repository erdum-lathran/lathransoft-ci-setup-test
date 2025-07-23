#!/bin/bash
set -euo pipefail

DEPLOY_BRANCH="main"
DEPLOY_DIRECTORY="./deploy/"

git checkout $DEPLOY_BRANCH

npm ci

npm run build

tar -czf /tmp/dist.tar.gz ./dist

tar -czf /tmp/dist-node-modules.tar.gz ./node_modules

mkdir ./transfer

mv /tmp/dist.tar.gz ./transfer/
mv /tmp/dist-node-modules.tar.gz ./transfer/

mv package.json ./transfer/
mv package-lock.json ./transfer/

# mv $DEPLOY_DIRECTORY ./transfer/
