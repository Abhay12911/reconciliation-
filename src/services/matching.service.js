import Transaction from "../models/transaction.model.js";

// type mapping
const typeMap = {
  TRANSFER_IN: "TRANSFER_OUT",
  TRANSFER_OUT: "TRANSFER_IN"
};

// asset mapping
const assetMap = {
  btc: "bitcoin",
  bitcoin: "bitcoin",
  eth: "ethereum",
  ethereum: "ethereum",
  usdt: "usdt",
  sol: "sol",
  matic: "matic",
  link: "link"
};

const normalizeAsset = (asset) => {
  return assetMap[asset?.toLowerCase()] || asset?.toLowerCase();
};

export const matchTransactions = async (runId, config) => {
  const userTx = await Transaction.find({
    runId,
    source: "USER",
    isValid: true
  });

  const exchangeTx = await Transaction.find({
    runId,
    source: "EXCHANGE",
    isValid: true
  });

  const results = [];
  const usedExchange = new Set();

  for (let u of userTx) {
    let found = false;

    for (let e of exchangeTx) {
      if (usedExchange.has(e._id.toString())) continue;

      // asset match
      if (normalizeAsset(u.asset) !== normalizeAsset(e.asset)) continue;

      // type match
      const mappedType = typeMap[u.type] || u.type;
      if (mappedType !== e.type) continue;

      // timestamp check
      const timeDiff =
        Math.abs(new Date(u.timestamp) - new Date(e.timestamp)) / 1000;
      if (timeDiff > config.timestampTolerance) continue;

      // quantity check
      const qtyDiff = Math.abs(u.quantity - e.quantity) / u.quantity;
      if (qtyDiff > config.quantityTolerance) continue;

      // match found
      usedExchange.add(e._id.toString());
      found = true;

      //  CONFLICT CHECK
      const feeDiff = Math.abs((u.fee || 0) - (e.fee || 0));
      const priceDiff = Math.abs((u.price || 0) - (e.price || 0));

      let status = "MATCHED";
      let reason = "Within tolerance";

      if (feeDiff > 0.00001) {
        status = "CONFLICT";
        reason = "Fee mismatch";
      }

      if (priceDiff > 1) {
        status = "CONFLICT";
        reason = "Price mismatch";
      }

      results.push({
        user: u,
        exchange: e,
        status,
        reason
      });

      break;
    }

    if (!found) {
      results.push({
        user: u,
        exchange: null,
        status: "UNMATCHED_USER",
        reason: "No match found"
      });
    }
  }

  // remaining exchange unmatched
  for (let e of exchangeTx) {
    if (!usedExchange.has(e._id.toString())) {
      results.push({
        user: null,
        exchange: e,
        status: "UNMATCHED_EXCHANGE",
        reason: "No match found"
      });
    }
  }

  return results;
};