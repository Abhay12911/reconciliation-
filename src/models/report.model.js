import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  runId: String,
  userTransaction: Object,
  exchangeTransaction: Object,
  status: String, // MATCHED | CONFLICT | UNMATCHED_USER | UNMATCHED_EXCHANGE
  reason: String
});

export default mongoose.model("Report", reportSchema);