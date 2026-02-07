import { resInventory } from "../models/resModel.js";
import { checkAvailability, reduceStock } from "./inventoryService.js";
import { publishStockReserved, publishStockReleased, publishStockReduced } from "../producers/inventoryProducer.js";

export const reserveStock = async (orderId, items, amount) => {
  const availability = await checkAvailability(items);
  if (!availability.ok) {
    const { productId, required, available } = availability.insufficient;
    throw new Error(`Insufficient stock for ${productId}: required ${required}, available ${available}`);
  }
  
  const orderIdStr = String(orderId);
  await resInventory.create({
    orderId: orderIdStr,
    items: items.map(({ productId, quantity, price }) => ({ productId, quantity, price: price ?? 0 })),
    status: "PENDING",
  });
  await publishStockReserved(orderIdStr, items, amount);
};


export const releaseStock = async (orderId, reason = "payment failed") => {
  const orderIdStr = String(orderId);
  const res = await resInventory.findOneAndUpdate(
    { orderId: orderIdStr, status: "PENDING" },
    { status: "RELEASED" },
    { new: true }
  );
  if (!res) {
    console.warn("[resInvService] No PENDING reservation found for orderId:", orderId);
    return;
  }
  await publishStockReleased(orderIdStr, res.items, reason);
};


export const confirmAndReduceStock = async (orderId) => {
  const orderIdStr = String(orderId);
  const res = await resInventory.findOneAndUpdate(
    { orderId: orderIdStr, status: "PENDING" },
    { status: "CONFIRMED" },
    { new: true }
  );
  if (!res) {
    console.warn("[resInvService] No PENDING reservation found for orderId:", orderId);
    return;
  }
  const items = res.items.map(({ productId, quantity }) => ({ productId, quantity }));
  await reduceStock(items);
  await publishStockReduced(orderId, items);
};
