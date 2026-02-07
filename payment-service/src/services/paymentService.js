const processPayment = async (orderID, amount) => {
  const success = Math.random() > 0.2;
  if (!success) {
    return {
      status: "FAILED",
      error: "Payment declined by bank",
    };
  }
  return {
    status: "SUCCESS",
    transactionID: crypto.randomUUID(),
    amount,
  };
};

export default processPayment;