#  KoinX Transaction Reconciliation Engine

##  Overview

This project implements a **Transaction Reconciliation Engine** in Node.js that compares transaction data from two sources:

* **User Transactions** (user-uploaded CSV)
* **Exchange Transactions** (exchange-exported CSV)

The system identifies:

* ✅ Matched transactions
* ⚠️ Conflicting transactions
* ❌ Unmatched transactions

This mimics a real-world financial reconciliation system handling **messy and inconsistent data**.

---

##  Key Features

### 1.  Data Ingestion

* Parses CSV files using `csv-parser`
* Stores data in MongoDB
* Handles invalid data gracefully:

  * Missing fields
  * Invalid timestamps
  * Negative quantities
* Invalid rows are **not dropped**, instead stored with:

  * `isValid: false`
  * `errorReason`

---

### 2. Matching Engine

Transactions are matched based on configurable tolerance:

| Field     | Logic                                  |
| --------- | -------------------------------------- |
| Timestamp | ± configurable window (default: 5 min) |
| Quantity  | ± configurable % (default: 0.01%)      |
| Asset     | Case-insensitive + alias mapping       |
| Type      | Exact match + reverse mapping          |

#### 🔄 Type Mapping

* `TRANSFER_IN` ↔ `TRANSFER_OUT`

####  Asset Normalization

* BTC = Bitcoin
* ETH = Ethereum
* Case-insensitive matching

---

### 3. ⚠️ Conflict Detection

Even if transactions match, they may be marked as **CONFLICT** if:

* Fee differs beyond threshold
* Price differs beyond threshold

---

### 4.  Reconciliation Report

Each transaction is categorized as:

* ✅ `MATCHED`
* ⚠️ `CONFLICT`
* ❌ `UNMATCHED_USER`
* ❌ `UNMATCHED_EXCHANGE`

Reports are:

* Stored in MongoDB
* Exported as CSV file

---

### 5. 🌐 API Endpoints

#### 🔹 Trigger Reconciliation

```
POST /api/reconcile
```

Optional body:

```json
{
  "timestampTolerance": 300,
  "quantityTolerance": 0.01
}
```

---

#### 🔹 Get Full Report

```
GET /api/report/:runId
```

---

#### 🔹 Get Summary

```
GET /api/report/:runId/summary
```

Response:

```json
{
  "matched": 20,
  "conflict": 1,
  "unmatchedUser": 2,
  "unmatchedExchange": 3
}
```

---

#### 🔹 Get Unmatched Transactions

```
GET /api/report/:runId/unmatched
```

---

## ⚙️ Setup Instructions

### 1 Clone Repository

```bash
git clone <your-repo-link>
cd koinx-reconciliation-engine
```

---

### 2️ Install Dependencies

```bash
npm install
```

---

### 3️ Setup Environment Variables

Create `.env` file:

```env
MONGO_URI=mongodb://127.0.0.1:27017/koinx
TIMESTAMP_TOLERANCE_SECONDS=300
QUANTITY_TOLERANCE_PCT=0.01
```

---

### 4️ Add CSV Files

Place input files inside:

```
uploads/
  user_transactions.csv
  exchange_transactions.csv
```

---

### 5️ Run Server

```bash
npm run dev
```

Server runs at:

```
http://localhost:3000
```

---

## 🧪 Testing

Use Postman:

### Run reconciliation:

```
POST http://localhost:3000/api/reconcile
```

---

### Fetch report:

```
GET http://localhost:3000/api/report/:runId
```

---

## 📁 Project Structure

```
src/
  controllers/
  services/
  models/
  routes/
  utils/
  config/
uploads/
reports/
```




## Author

Abhay Mishra
