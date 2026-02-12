# 构建
FROM node:25.6.1-slim AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# 运行
FROM node:25.6.1-slim

ENV NODE_ENV=production
WORKDIR /app

COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app ./

USER node

CMD sh -c "node client.js --code ${CODE}"
