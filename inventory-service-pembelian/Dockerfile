FROM node:18-alpine

WORKDIR /usr/src/app

COPY ./inventory-service-pembelian/package.json ./
COPY ./inventory-service-pembelian/yarn.lock* ./inventory-service-pembelian/package-lock.json* ./inventory-service-pembelian/pnpm-lock.yaml* ./
RUN npm install

COPY ./inventory-service-pembelian .

RUN npx prisma generate

EXPOSE 3000

CMD ["npx", "ts-node", "src/index.ts"]
