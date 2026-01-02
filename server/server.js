const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

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

// Proxy endpoint for Google Places API (to avoid CORS issues)
// Use app.use with a path prefix to catch all routes under /api/places/
app.use("/api/places", async (req, res, next) => {
  try {
    // Get the path after /api/places/ (e.g., "place/details/json")
    // Extract from the original URL to get everything after /api/places/ (before query string)
    const urlPath = req.originalUrl.split('?')[0]; // Remove query string
    const match = urlPath.match(/^\/api\/places\/(.+)/);
    const apiPath = match ? match[1] : urlPath.replace(/^\/api\/places\/?/, '');
    const apiKey = process.env.GOOGLE_PLACES_API_KEY || req.query.key;
    
    if (!apiKey) {
      return res.status(400).json({ error: "API key is required" });
    }

    // Extract query parameters (excluding 'key' which we'll add separately)
    const queryParams = new URLSearchParams();
    Object.keys(req.query).forEach(key => {
      if (key !== 'key') {
        queryParams.append(key, req.query[key]);
      }
    });
    queryParams.append('key', apiKey);
    
    // Build the Google Places API URL
    const queryString = queryParams.toString();
    const googleUrl = `https://maps.googleapis.com/maps/api/${apiPath}?${queryString}`;
    
    // Make the request to Google Places API
    https.get(googleUrl, (googleRes) => {
      let data = '';
      
      googleRes.on('data', (chunk) => {
        data += chunk;
      });
      
      googleRes.on('end', () => {
        res.setHeader('Content-Type', 'application/json');
        res.status(googleRes.statusCode).send(data);
      });
    }).on('error', (err) => {
      console.error('Google Places API proxy error:', err);
      res.status(500).json({ error: 'Failed to fetch from Google Places API' });
    });
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
