import dotenv from "dotenv";
dotenv.config();

import { Kafka } from "kafkajs";

let kafkaInstance = null;

const getKafka = () => {
  if (!kafkaInstance) {
    
    kafkaInstance = new Kafka({
      clientId: "order-service",
      brokers: [process.env.KAFKA_BROKER ],
    });
  }
  return kafkaInstance;
};

export default getKafka;