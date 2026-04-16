
import { v4 as uuidv4 } from "uuid";
import { parseCSV } from "../utils/csvParser.js";
import { ingestTransactions } from "../services/ingestion.service.js";
import { matchTransactions } from "../services/matching.service.js";

export const reconcile = async (req, res) => {
  try {
    const runId = uuidv4();

    const config = {
      timestampTolerance: req.body.timestampTolerance || 300,
      quantityTolerance: req.body.quantityTolerance || 0.01
    };

    const userRows = await parseCSV("uploads/user_transactions.csv");
    const exchangeRows = await parseCSV("uploads/exchange_transactions.csv");

    await ingestTransactions(userRows, "USER", runId);
    await ingestTransactions(exchangeRows, "EXCHANGE", runId);

    const result = await matchTransactions(runId, config);

    res.json({ runId, result });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};