require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const XLSX = require("xlsx");
const sequelize = require("./config/db");
const Customer = require("./models/Customer");

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

// Health check
app.get("/", (req, res) => {
  res.json({ message: "SalonGenie Backend Running" });
});

// Upload customers + store in DB
app.post("/api/customers/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    let inserted = [];

    for (let row of jsonData) {
      const customer = await Customer.create({
        name: row.Name || row.name || null,
        phone: String(row.Phone || row.phone || "").trim(),
        lastVisit: row.LastVisit ? new Date(row.LastVisit) : null,
        service: row.Service || row.service || null,
      });

      inserted.push(customer);
    }

    return res.json({
      message: "Upload successful",
      total: inserted.length,
      inserted,
    });

  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ error: "Failed to upload customers" });
  }
});

const PORT = process.env.PORT || 8000;

// Start DB + Server
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Database connection OK");
    return sequelize.sync();
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Backend + DB running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err);
  });
