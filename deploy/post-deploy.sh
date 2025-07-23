#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")"

tar -xzf ../dist.tar.gz -C ../../

tar -xzf ../dist-node-modules.tar.gz -C ../../
