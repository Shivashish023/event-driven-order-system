import { Kafka } from "kafkajs";
import dotenv from "dotenv";
dotenv.config();
let kafkaInstance = null;
const getKafka = () => {
    if (!kafkaInstance) {
        kafkaInstance = new Kafka({
            clientId: "payment-service",
            brokers: [process.env.KAFKA_BROKER],
        });
    }
    return kafkaInstance;
};
export default getKafka;