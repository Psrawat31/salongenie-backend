const express = require("express");
const cors = require("cors");
const multer = require("multer");
const XLSX = require("xlsx");

const app = express();
app.use(cors());
app.use(express.json());

// Storage for uploaded files
const upload = multer({ storage: multer.memoryStorage() });

// Test route
app.get("/", (req, res) => {
  res.json({ message: "SalonGenie Backend Running" });
});

// Upload route
app.post("/api/customers/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

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
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
