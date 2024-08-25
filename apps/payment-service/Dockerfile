FROM node:18-alpine

RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY ./payment-service/package.json ./payment-service/yarn.lock* ./payment-service/package-lock.json* ./payment-service/pnpm-lock.yaml* ./

RUN \
    if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then npm i -g pnpm && pnpm i --frozen-lockfile; \
    else echo 'Lockfile not found.' && exit 1; \
    fi

COPY ./payment-service .

RUN npx prisma generate
RUN npm run build

CMD ["npm", "start"]

EXPOSE 3005