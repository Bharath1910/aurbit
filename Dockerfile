FROM node:23-alpine
WORKDIR /app

COPY ./package.json .
COPY ./dist .

COPY ./src/templates /app/src/templates
COPY ./public ./public

RUN npm install --omit=dev && npm cache clean --force

CMD ["node", "index.js"]
