# Setup

1. Install ts-node globally if you haven't already.

   `npm install -g ts-node`

1. To run locally, first start a Docker container:

   `docker run --rm -e PORGRES_HOST_AUTH_METHOD=trust -p 5432:5432 -it postgres:14.1-alpine`

1. Then start the node server:

   `npm run serve`
