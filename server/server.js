const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const DB_PATH = path.join(__dirname, "data.json");

// Ensure DB file exists
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, "[]", "utf8");
}

function readDB() {
  return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf8");
}

// GET all items
app.get("/api/items", (req, res) => {
  res.json(readDB());
});

// POST create an item
app.post("/api/items", (req, res) => {
  const { title, notes } = req.body || {};
  if (!title || typeof title !== "string") {
    return res.status(400).json({ error: "title is required" });
  }

  const items = readDB();
  const newItem = {
    id: Date.now().toString(),
    title: title.trim(),
    notes: typeof notes === "string" ? notes.trim() : "",
    createdAt: new Date().toISOString(),
  };

  items.unshift(newItem);
  writeDB(items);
  res.status(201).json(newItem);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
