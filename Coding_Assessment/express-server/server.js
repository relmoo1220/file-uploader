const express = require("express");
const csv = require("csv-parser");
const fs = require("fs");
const cors = require("cors");
const multer = require("multer");

const app = express();
app.use(express.json());
app.use(cors());

// Set up Multer for handling file uploads
const upload = multer({ dest: "uploads/" });

// Handle POST request for uploading CSV file
app.post("/read-csv", upload.single("csvFile"), (req, res) => {
  if (!req.file || req.file.mimetype !== "text/csv") {
    return res.status(400).json({ error: "Please upload a valid CSV file." });
  }
  
  const results = [];
  const filePath = req.file.path;

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      // Delete the uploaded file after reading
      fs.unlinkSync(filePath);
      res.json(results);
    });
});

module.exports = app;
