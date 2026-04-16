import Report from "../models/report.model.js";

// full report
export const getReport = async (req, res) => {
  const { runId } = req.params;

  const data = await Report.find({ runId });

  res.json(data);
};

// summary
export const getSummary = async (req, res) => {
  const { runId } = req.params;

  const data = await Report.find({ runId });

  const summary = {
    matched: 0,
    conflict: 0,
    unmatchedUser: 0,
    unmatchedExchange: 0
  };

  for (let r of data) {
    if (r.status === "MATCHED") summary.matched++;
    else if (r.status === "CONFLICT") summary.conflict++;
    else if (r.status === "UNMATCHED_USER") summary.unmatchedUser++;
    else if (r.status === "UNMATCHED_EXCHANGE") summary.unmatchedExchange++;
  }

  res.json(summary);
};

// unmatched only
export const getUnmatched = async (req, res) => {
  const { runId } = req.params;

  const data = await Report.find({
    runId,
    status: { $in: ["UNMATCHED_USER", "UNMATCHED_EXCHANGE"] }
  });

  res.json(data);
};