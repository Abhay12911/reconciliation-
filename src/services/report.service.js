import fs from "fs";
import path from "path";
import Report from "../models/report.model.js";

export const saveReport = async (runId, results) => {
  const docs = results.map(r => ({
    runId,
    userTransaction: r.user,
    exchangeTransaction: r.exchange,
    status: r.status,
    reason: r.reason
  }));

  await Report.insertMany(docs);

  // generate CSV file
  const filePath = path.join("reports", `${runId}.csv`);

  const headers = [
    "status",
    "reason",
    "user_id",
    "exchange_id",
    "asset",
    "type",
    "quantity"
  ];

  const rows = results.map(r => [
    r.status,
    r.reason,
    r.user?.transactionId || "",
    r.exchange?.transactionId || "",
    r.user?.asset || r.exchange?.asset || "",
    r.user?.type || r.exchange?.type || "",
    r.user?.quantity || r.exchange?.quantity || ""
  ]);

  const csvContent =
    [headers, ...rows]
      .map(e => e.join(","))
      .join("\n");

  fs.writeFileSync(filePath, csvContent);

  return filePath;
};