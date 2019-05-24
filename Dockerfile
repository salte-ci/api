FROM node:alpine

WORKDIR /build
COPY . /build

EXPOSE 8080
CMD ["npm", "start"]
