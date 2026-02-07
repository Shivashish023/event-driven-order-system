import getKafka from "../config/kafka.js";

const producer = getKafka().producer();
let isConnected = false;

const publishOrderCreated = async (order) => {
    try {
       
        if (!isConnected) {
            await producer.connect();
            isConnected = true;
            console.log("Kafka producer connected");
        }
        
        await producer.send({
            topic: "order-events",
            messages: [{
                value: JSON.stringify({
                    eventType: "Order_CREATED",
                    orderID: order._id,
                    amount: order.totalAmount,
                    items: order.items,
                }),
            }],
        });
        console.log("ORDER_CREATED event published:", order._id);
    } catch (error) {
        
        console.error("Failed to publish order event to Kafka:", error.message);
        
        isConnected = false;
    }
}

export default publishOrderCreated;
