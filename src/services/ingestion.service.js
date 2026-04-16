import Transaction from "../models/transaction.model.js";

export const ingestTransactions = async (rows, source, runId) => {
  const docs = [];

  for (let row of rows) {
    try {
      if (!row.timestamp || !row.quantity) {
        throw new Error("Missing required fields");
      }

      // timestamp validation
      const parsedTimestamp = new Date(row.timestamp);
      if (isNaN(parsedTimestamp.getTime())) {
        throw new Error("Invalid timestamp");
      }

      // quantity validation
      const quantity = parseFloat(row.quantity);

      if (isNaN(quantity)) {
        throw new Error("Invalid quantity");
      }

      if (quantity <= 0) {
        throw new Error("Negative or zero quantity");
      }

      docs.push({
        source,
        runId,
        transactionId: row.transaction_id || row.id,
        timestamp: parsedTimestamp,
        asset: row.asset,
        type: row.type,
        quantity: quantity,
        price: parseFloat(row.price_usd || row.price || 0),
        fee: parseFloat(row.fee || 0),
        rawData: row,
        isValid: true
      });

    } catch (err) {
      docs.push({
        source,
        runId,
        rawData: row,
        isValid: false,
        errorReason: err.message
      });
    }
  }

  await Transaction.insertMany(docs);
};