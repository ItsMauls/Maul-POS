FROM node:18-alpine

RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY ./sales-service/package.json ./sales-service/yarn.lock* ./sales-service/package-lock.json* ./sales-service/pnpm-lock.yaml* ./

RUN \
    if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then npm i -g pnpm && pnpm i --frozen-lockfile; \
    else echo 'Lockfile not found.' && exit 1; \
    fi

COPY ./sales-service .

RUN npx prisma generate
RUN npm run build

CMD ["npm", "start"]

EXPOSE 3005