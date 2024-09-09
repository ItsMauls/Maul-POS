FROM node:18-alpine

RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY . .

WORKDIR /app/apps/user-service

RUN npm install

RUN npx prisma generate
RUN npm run build

CMD ["npm", "start"]

EXPOSE 3006