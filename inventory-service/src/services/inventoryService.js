import { Inventory } from "../models/inventoryModel.js";
import { resInventory } from "../models/resModel.js";

const checkAvailability = async (items) => {
    try {
        console.log("Checking availability for items:", items);
        
        const productIds = items.map((item) => item.productId);
        const [inventory, reservedAgg] = await Promise.all([
            Inventory.find({ productId: { $in: productIds } }),
            resInventory.aggregate([
                { $match: { status: "PENDING" } },
                { $unwind: "$items" },
                { $match: { "items.productId": { $in: productIds } } },
                { $group: { _id: "$items.productId", total: { $sum: "$items.quantity" } } },
            ]),
        ]);

        const inventoryMap = new Map(inventory.map((inv) => [inv.productId, inv]));

        const reservedMap = new Map(reservedAgg.map((r) => [r._id, r.total]));
        for (const item of items) {
            const inv = inventoryMap.get(item.productId);
            if (!inv) {
                return { ok: false, insufficient: { productId: item.productId, required: item.quantity, available: 0 } };
            }
            const reserved = reservedMap.get(item.productId) ?? 0;
            const available = Math.max(0, inv.quantity - reserved);
            if (available < item.quantity) {
                return { ok: false, insufficient: { productId: item.productId, required: item.quantity, available } };
            }
        }
        return { ok: true };
    } catch (error) {
        console.error("Error checking availability:", error);
        return { ok: false, insufficient: { productId: items[0]?.productId, required: items[0]?.quantity ?? 0, available: 0 } };
    }
};


const reduceStock = async (items) => {
    for (const item of items) {
        await Inventory.findOneAndUpdate(
            { productId: item.productId },
            { $inc: { quantity: -item.quantity } },
            { new: true }
        );
    }
};

export { checkAvailability, reduceStock  };