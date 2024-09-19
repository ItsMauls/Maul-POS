FROM node:18-alpine

RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY ./apps/sales-service/package.json ./apps/sales-service/yarn.lock* ./apps/sales-service/package-lock.json* ./apps/sales-service/pnpm-lock.yaml* ./

# Debug: Display contents of package.json
RUN cat ./package.json

# Check npm and node versions
RUN node --version && npm --version

# Clear npm cache
RUN npm cache clean --force

# Remove package-lock.json if exists
RUN rm -f package-lock.json

# Install dependencies with verbose logging
RUN npm i --verbose

COPY ./apps/sales-service .

# RUN npx prisma migrate dev
RUN npx prisma generate
RUN npm run build

CMD ["npm", "start"]

EXPOSE 3007