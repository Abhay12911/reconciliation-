

import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  source: String, // USER | EXCHANGE
  runId: String,

  transactionId: String,
  timestamp: Date,
  asset: String,
  type: String,
  quantity: Number,
  price: Number,
  fee: Number,

  rawData: Object,

  isValid: { type: Boolean, default: true },
  errorReason: String
});

export default mongoose.model("Transaction", transactionSchema);