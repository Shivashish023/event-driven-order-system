import { resInventory } from "../models/resModel.js";
import { checkAvailability, reduceStock } from "./inventoryService.js";
import { publishStockReserved, publishStockReleased, publishStockReduced } from "../producers/inventoryProducer.js";

const getReservationTtlMs = () => {
  const minutes = Number(process.env.RESERVATION_TTL_MINUTES) || 15;
  return minutes * 60 * 1000;
};

export const reserveStock = async (orderId, items, amount) => {
  const availability = await checkAvailability(items);
  if (!availability.ok) {
    const { productId, required, available } = availability.insufficient;
    throw new Error(`Insufficient stock for ${productId}: required ${required}, available ${available}`);
  }
  
  const orderIdStr = String(orderId);
  const expiresAt = new Date(Date.now() + getReservationTtlMs());
  await resInventory.create({
    orderId: orderIdStr,
    items: items.map(({ productId, quantity, price }) => ({ productId, quantity, price: price ?? 0 })),
    status: "PENDING",
    expiresAt,
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
    return false;
  }
  await publishStockReleased(orderIdStr, res.items, reason);
  return true;
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

export const releaseExpiredReservations = async () => {
  const expired = await resInventory
    .find({ status: "PENDING", expiresAt: { $lte: new Date() } })
    .select("orderId")
    .lean();

  if (!expired.length) return 0;

  let released = 0;
  for (const reservation of expired) {
    const didRelease = await releaseStock(reservation.orderId, "reservation expired");
    if (didRelease) released += 1;
  }

  console.log(`[resInvService] Released ${released} expired reservation(s)`);
  return released;
};
