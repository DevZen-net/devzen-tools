ARG NODE_VERSION=20.18.0
FROM node:$NODE_VERSION AS neozen

# see https://docs.docker.com/engine/reference/builder/#understand-how-arg-and-from-interact
ARG NODE_VERSION
RUN echo "Docker image FROM 'node:${NODE_VERSION}' with NODE_VERSION=${NODE_VERSION}"

WORKDIR /home/service-project

LABEL version="${NODE_VERSION}"
