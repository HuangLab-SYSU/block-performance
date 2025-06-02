FROM node:latest

ADD ./block-performance-1.0.0 /cloud/block-performance-1.0.0

# build
WORKDIR /cloud/block-performance-1.0.0
RUN npm install
RUN npm run build

# customize
ADD ./block-performance-1.0.0-customize /cloud/block-performance-1.0.0/customize

# pack
WORKDIR /cloud
RUN tar czvf block-performance-1.0.0.tar.gz block-performance-1.0.0/