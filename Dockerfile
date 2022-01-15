# STAGE 1
FROM node:16-alpine
WORKDIR /usr
COPY package*.json ./
COPY tsconfig.json ./
COPY .sequelizerc ./
COPY babel.config.js ./
COPY src ./src
RUN npm ci
RUN npm run build

# STAGE 2
FROM node:16-alpine
WORKDIR /usr
COPY package*.json ./
RUN npm ci --production
COPY --from=0 /usr/build .
RUN npm install pm2 -g

EXPOSE 3000
CMD [ "pm2-runtime", "src/app.js" ]