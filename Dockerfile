# Stage 1: Frontend Build
FROM node:14 as frontend
WORKDIR /app/transcendence-front
COPY ./transcendence-front/package.json ./transcendence-front/package-lock.json ./
RUN npm install
COPY ./transcendence-front ./
RUN npm run build

# Stage 2: Backend Build
FROM node:14 as backend
WORKDIR /app/transcendence-back
COPY ./transcendence-back/package.json ./transcendence-back/package-lock.json ./
RUN npm install
COPY ./transcendence-back ./
RUN npm run build

# Stage 3: Final Image
FROM node:14
WORKDIR /app
COPY --from=frontend /app/transcendence-front/build ./transcendence-front/build
COPY --from=backend /app/transcendence-back/dist ./transcendence-back/dist
COPY .env .
EXPOSE 4444
EXPOSE 3000
CMD ["node", "transcendence-back/dist/main.js"]