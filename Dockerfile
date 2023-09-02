# Build Stage 1
# This build created a staging docker image 
#
FROM node:10.15.2-alpine AS appbuild
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD npm start