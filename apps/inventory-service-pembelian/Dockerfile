FROM node:18-alpine

RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY ./apps/inventory-service-pembelian/package.json ./apps/inventory-service-pembelian/yarn.lock* ./apps/inventory-service-pembelian/package-lock.json* ./apps/inventory-service-pembelian/pnpm-lock.yaml* ./

RUN \
    if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then npm i -g pnpm && pnpm i --frozen-lockfile; \
    else echo 'Lockfile not found.' && exit 1; \
    fi

COPY ./apps/inventory-service-pembelian .

# RUN npx prisma migrate dev
RUN npx prisma generate
RUN npm run build

CMD ["npm", "start"]

EXPOSE 3003