FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN export NODE_ENV=production
RUN npm install

COPY src/ ./
COPY tsconfig-docker.json ./tsconfig.json
RUN npm run build

FROM node:20-alpine

WORKDIR /usr/app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/public /usr/app/public
COPY --from=build /app/services/mail/templates /usr/app/services/mail/templates
COPY --from=build /app/dist ./

CMD ["node", "index.js"]
