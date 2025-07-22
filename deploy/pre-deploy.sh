#!/bin/bash
set -euo pipefail

DEPLOY_BRANCH="main"
DEPLOY_DIRECTORY="./deploy/"

git checkout $DEPLOY_BRANCH

npm ci

npm run build
