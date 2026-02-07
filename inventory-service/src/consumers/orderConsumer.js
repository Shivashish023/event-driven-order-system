import getKafka from "../config/kafka.js";
import { reserveStock } from "../services/resInvService.js";

const consumer = getKafka().consumer({ groupId: "inventory-service-order-consumer" });

const run = async () => {
  try {
    await consumer.connect();
    console.log("[inventory-service] Order consumer connected");
    await consumer.subscribe({ topic: "order-events", fromBeginning: false });
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const event = JSON.parse(message.value.toString());
          if (event.eventType !== "Order_CREATED") return;
          const { orderID, items, amount } = event;
          console.log("[inventory-service] Processing order:", orderID);
          if (!orderID || !items?.length) {
            console.warn("[inventory-service] Invalid Order_CREATED event:", event);
            return;
          }
          await reserveStock(orderID, items, amount);    
          console.log("[inventory-service] Reserved stock for order:", orderID);
        } catch (err) {
          console.error("[inventory-service] Error processing order event:", err.message);
        }                                          
      },
    });
  } catch (err) {  
    console.error("[inventory-service] Order consumer connection error:", err.message);
  }
};


run().catch(console.error);
export default run;
