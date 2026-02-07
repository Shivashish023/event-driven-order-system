import getKafka from "../config/kafka.js";
import { confirmAndReduceStock, releaseStock } from "../services/resInvService.js";

const consumer = getKafka().consumer({ groupId: "inventory-service-payment-consumer" });

const run = async () => {
  try {
    await consumer.connect();
    console.log("[inventory-service] Payment consumer connected");
    await consumer.subscribe({ topic: "payment-events", fromBeginning: false });
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const event = JSON.parse(message.value.toString());
          const { eventType, orderID } = event;
          if (!orderID) {
            console.warn("[inventory-service] Payment event missing orderID:", event);
            return;
          }
          if (eventType === "PAID") {
            await confirmAndReduceStock(orderID);
            console.log("[inventory-service] Stock reduced for paid order:", orderID);
          } else if (eventType === "FAILED") {
            await releaseStock(orderID, "payment failed");
            console.log("[inventory-service] Reservation released for failed order:", orderID);
          }
        } catch (err) {
          console.error("[inventory-service] Error processing payment event:", err.message);
        }
      },
    });
  } catch (err) {
    console.error("[inventory-service] Payment consumer connection error:", err.message);
  }
};

run().catch(console.error);
export default run;
