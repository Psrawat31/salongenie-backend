require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const XLSX = require("xlsx");
const sequelize = require("./db/init");

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

// Health check
app.get("/", (req, res) => {
  res.json({ message: "SalonGenie Backend Running" });
});

// Upload customers
app.post("/api/customers/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    // TODO: later we will insert jsonData into the DB.
    // For now we just return it.
    return res.json({
      message: "Upload successful",
      total: jsonData.length,
      data: jsonData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to process file" });
  }
});

const PORT = process.env.PORT || 8000;

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
