FROM node:16-alpine3.16

WORKDIR /srcs

COPY ./ ./

RUN npm install

EXPOSE 4444 

#ENTRYPOINT ["tail", "-f", "/dev/null"]
ENTRYPOINT ["npm", "run", "start"]
