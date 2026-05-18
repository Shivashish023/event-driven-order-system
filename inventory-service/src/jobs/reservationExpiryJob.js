import { releaseExpiredReservations } from "../services/resInvService.js";

const DEFAULT_INTERVAL_MS = 60_000;

export const startReservationExpiryJob = () => {
  const intervalMs =
    Number(process.env.RESERVATION_EXPIRY_CHECK_MS) || DEFAULT_INTERVAL_MS;

  const run = async () => {
    try {
      await releaseExpiredReservations();
    } catch (err) {
      console.error("[inventory-service] Reservation expiry job failed:", err.message);
    }
  };

  run();
  const timer = setInterval(run, intervalMs);

  console.log(
    `[inventory-service] Reservation expiry job started (every ${intervalMs / 1000}s)`
  );

  return timer;
};
