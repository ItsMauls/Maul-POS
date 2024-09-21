import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient() as any

prisma.$connect()
  .then(() => {
    console.log('Successfully connected to the database')
  })
  .catch((error: any) => {
    console.error('Failed to connect to the database:', error)
  })

export default prisma;
