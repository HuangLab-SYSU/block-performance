#!/bin/bash

set -e

docker build --tag block-performance-1.0.0-image .
docker run --name block-performance-1.0.0-container block-performance-1.0.0-image
docker cp block-performance-1.0.0-container:/cloud/block-performance-1.0.0.tar.gz ./

docker container rm block-performance-1.0.0-container
docker image rm block-performance-1.0.0-image

mkdir output && tar zxvf block-performance-1.0.0.tar.gz -C ./output/
mv block-performance-1.0.0.tar.gz ./output/