FROM node:18-alpine

RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy entire project
COPY . .

# Install dependencies
WORKDIR /app/apps/user-service
RUN npm install --verbose

# Generate Prisma client with correct binary targets
# RUN npx prisma generate --schema=./prisma/schema.prisma

# Build the application
RUN npm run build

CMD ["npm", "run", "dev"]

EXPOSE 3003