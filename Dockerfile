FROM node:16.3.0-alpine

WORKDIR /code

COPY .env.example /code/.env

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . .

RUN npm run build

CMD [ "node", "dist/main.js" ]