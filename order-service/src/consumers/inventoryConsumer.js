import getKafka from "../config/kafka.js";
import { updateOrderStatus } from "../service/orderService.js";

const consumer = getKafka().consumer({
  groupId: "order-service-inventory-consumer",
});

const run = async () => {
  try {
    await consumer.connect();
    console.log("[Order-service] Inventory consumer connected ");
    await consumer.subscribe({topic: "inventory-events",fromBeginning: false,});

    await consumer.run({
      eachMessage: async ({ message }) => {
        try {
          const inventoryEvent = JSON.parse(message.value.toString());
          const { eventType, orderID } = inventoryEvent;

          if (eventType === "STOCK_REDUCED") {
            await updateOrderStatus(orderID, "PAID");
            console.log(`Order ${orderID} marked as PAID`);
          }

          else if (eventType === "STOCK_RELEASED") {
            await updateOrderStatus(orderID, "FAILED");
            console.log(`Order ${orderID} marked as FAILED`);
          }
        } catch (error) {
          console.error("Error processing inventory event:", error.message);
        }
      },
    });

  } catch (error) {
    console.error("Inventory consumer connection error:", error.message);
  }
};

run().catch(console.error);

export default run;
