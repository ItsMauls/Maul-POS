FROM node:18-alpine

RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy entire project
COPY . .

# Install dependencies
WORKDIR /app/apps/user-service
RUN npm install --verbose

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

CMD ["node", "dist/src/index.js"]

EXPOSE 3003