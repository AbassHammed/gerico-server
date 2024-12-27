FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY src/ ./
COPY tsconfig.json ./
RUN npm run build

FROM node:20-alpine

WORKDIR /usr/src/app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./

CMD ["node", "dist/index.js"]
