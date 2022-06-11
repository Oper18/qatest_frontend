FROM node:latest

RUN mkdir /app
WORKDIR /app
COPY package.json /app
RUN npm install --legacy-peer-deps

CMD ["npm", "run", "start"]
