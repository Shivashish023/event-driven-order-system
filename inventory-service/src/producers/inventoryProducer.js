import getKafka from "../config/kafka.js";

const producer=getKafka().producer();

const publishStockReserved=async(orderId,items,amount)=>{ 
    try {
        await producer.connect();
        await producer.send({
        topic: "inventory-events",
        messages: [{ value: JSON.stringify({ eventType: "STOCK_RESERVED", orderID: orderId, items, amount }) }],
    });
    console.log(`[inventory-service] Published STOCK_RESERVED: ${orderId}`);
    return true;
    } catch (error) {
        console.error("[inventory-service] Publish failed:", error.message);
        return false;
    }
}

const publishStockReduced=async(orderId,items)=>{
    try {
        await producer.connect();
        await producer.send({
        topic: "inventory-events",
        messages: [{ value: JSON.stringify({ eventType: "STOCK_REDUCED", orderID: orderId, items }) }],
    });
    console.log(`[inventory-service] Published STOCK_REDUCED: ${orderId}`);
    return true;
    } catch (error) {
        console.error("[inventory-service] Publish failed:", error.message);
        return false;
    }
}
const publishStockReleased=async(orderId,items,reason)=>{
    try {
        await producer.connect();
        await producer.send({
        topic: "inventory-events",
        messages: [{ value: JSON.stringify({ eventType: "STOCK_RELEASED", orderID: orderId, items, reason }) }],
    });
    console.log(`[inventory-service] Published STOCK_RELEASED: ${orderId}`);
    return true;
    } catch (error) {
        console.error("[inventory-service] Publish failed:", error.message);
        return false;
    }
}
export {publishStockReserved, publishStockReduced, publishStockReleased};