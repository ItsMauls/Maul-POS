FROM node:18-alpine

RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY ./apps/report-service/package.json ./apps/report-service/yarn.lock* ./apps/report-service/package-lock.json* ./apps/report-service/pnpm-lock.yaml* ./

RUN \
    if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then npm i -g pnpm && pnpm i --frozen-lockfile; \
    else echo 'Lockfile not found.' && exit 1; \
    fi

COPY ./apps/report-service .

# RUN npx prisma migrate dev
RUN npx prisma generate
RUN npm run build

CMD ["npm", "start"]

EXPOSE 3009