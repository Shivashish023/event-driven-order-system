import getKafka from "../config/kafka.js";
import processPayment from "../services/paymentService.js";
import publishPaymentEvent from "../producers/paymentProducer.js";

const consumer = getKafka().consumer({ groupId: "payment-service" });

const run = async () => {
  try {
    await consumer.connect();
    console.log("[payment-service] Inventory consumer connected");

    await consumer.subscribe({topic: "inventory-events",fromBeginning: false,});

    await consumer.run({
      eachMessage: async ({ message }) => {
        try {
          const inventoryEvent = JSON.parse(message.value.toString());
          console.log("Inventory event:", inventoryEvent);
          if (inventoryEvent.eventType !== "STOCK_RESERVED") return;

          const { orderID, items, amount } = inventoryEvent;
          console.log(" Processing payment for order:",orderID);

          const result = await processPayment(orderID, amount);
          if (result && result.status === "SUCCESS") {
            await publishPaymentEvent({
              transactionID: result.transactionID,
              orderID,
              status: "PAID",
              items,
              amount,
            });

          } else {
            await publishPaymentEvent({
              orderID,
              status: "FAILED",
              items,
              amount,
              error: result?.error || "Payment failed",
            });
          }

        } catch (error) {
          console.error(
            "[payment-service] Error processing inventory event:",
            error.message
          );
        }
      },
    });

  } catch (error) {
    console.error(
      "[payment-service] Inventory consumer connection error:",
      error.message
    );
  }
};

run().catch(console.error);

export default run;
