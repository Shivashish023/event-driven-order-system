import "dotenv/config";

export const SERVICES = {
    AUTH: process.env.AUTH_SERVICE,
    ORDER: process.env.ORDER_SERVICE,
    INVENTORY: process.env.INVENTORY_SERVICE,
    PAYMENT: process.env.PAYMENT_SERVICE
 };
 