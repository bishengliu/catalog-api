FROM node:10-alpine

WORKDIR /app

COPY ./package.json ./package-lock.json /app/

RUN apk --no-cache add --virtual builds-deps build-base python
RUN npm install

COPY . /app/

EXPOSE 3000
CMD ["npm", "run", "start:dev"]