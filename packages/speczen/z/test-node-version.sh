#!/bin/bash -e

if [ "$1" = "" ] ; then
  if [ "$NODE_VERSION" = "" ] ; then
    NODE_VERSION="20.18.0" # default
    echo "test-node-version.sh: WARNING - Using default node version=$NODE_VERSION - pass node_version as 1st arg (eg ./z/test-node-version.sh 20.18.0"
  else
    echo "test-node-version.sh: Using env NODE_VERSION=$NODE_VERSION - pass node_version as 1st arg (eg ./z/test-node-version.sh 20.18.0"
  fi
else
  NODE_VERSION=$1
fi

echo "test-node-version.sh: Testing with NODE_VERSION=$NODE_VERSION"

export NODE_VERSION=$NODE_VERSION

docker build --build-arg NODE_VERSION=$NODE_VERSION --tag speczen:$NODE_VERSION .

docker-compose run --rm --env NODE_VERSION=$NODE_VERSION --user 1000 speczen
