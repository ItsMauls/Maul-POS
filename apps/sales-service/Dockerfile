FROM node:18-alpine

RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy entire project
COPY . .

# Install dependencies for @auth
WORKDIR /app/libs/@auth
RUN npm install

# Build @auth
RUN npm run build

# Install dependencies for sales-service
WORKDIR /app/apps/sales-service
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Build sales-service
RUN npm run build

CMD ["npm", "start"]

EXPOSE 3007