FROM node:16-alpine3.16

WORKDIR /srcs

COPY ./ ./

RUN npm install

EXPOSE 3000

ENTRYPOINT ["npm", "start"]
