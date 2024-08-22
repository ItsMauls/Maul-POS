import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092'], // Sesuaikan dengan alamat broker Kafka Anda
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: 'my-group' });