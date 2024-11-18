#!/bin/bash -e

# Testing all node versions in .docker-node-versions - see https://medium.com/trabe/run-multiple-node-versions-in-ci-with-a-single-dockerfile-e24f80e466d

for NODE_VERSION in $(cat .docker-node-versions); do
  . ./z/test-node-version.sh $NODE_VERSION
done
