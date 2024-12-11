FROM node:20-alpine3.16
WORKDIR /usr
COPY package.json ./
COPY tsconfig.json ./
COPY src ./src
RUN npm install 
RUN npm run build --aot

## this is stage two , where the app actually runs
FROM node:20-alpine3.16
WORKDIR /usr
COPY package.json ./
RUN npm install --omit=dev
COPY --from=0 /usr/dist .
RUN npm install pm2 -g
EXPOSE 30000
CMD ["pm2-runtime", "server.js"] 