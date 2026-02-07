import getKafka from "../config/kafka.js";

const producer = getKafka().producer();

const publishPaymentEvent = async (paymentData) => {
  await producer.connect();
  const eventType = paymentData.status; 
  await producer.send({
    topic: "payment-events",
    messages: [
      {
        value: JSON.stringify({
          eventType: eventType,
          orderID: paymentData.orderID,
          amount: paymentData.amount,
          items: paymentData.items,
          transactionID: paymentData.transactionID ?? null,
          error: paymentData.error ?? null,
        }),
      },
    ],
  });

  console.log(
    `PAYMENT event published: ${eventType} for order ${paymentData.orderID}`
  );
};

export default publishPaymentEvent;