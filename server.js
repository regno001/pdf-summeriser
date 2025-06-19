const express = require("express");
const multer = require("multer");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.static("public"));
app.use(express.json());

const upload = multer({ dest: "uploads/" });

// 🔁 Dummy summarizer
const summarizeText = async (text) => {
  return `📄 Demo Summary:\n\n${text.slice(0, 400)}\n\n[Summary generated locally — no AI used]`;
};

app.post("/upload", upload.single("pdfFile"), async (req, res) => {
  const filePath = req.file.path;

  try {
    const fileData = fs.readFileSync(filePath);
    const pdfData = await pdfParse(fileData);
    const extractedText = pdfData.text?.trim();

    if (!extractedText) throw new Error("No text found in PDF.");

    const summary = await summarizeText(extractedText);
    fs.unlinkSync(filePath); // Cleanup uploaded file
    res.json({ summary });
  } catch (error) {
    console.error("❌ Error processing PDF:", error.message);
    res.status(500).json({ error: "Failed to summarize PDF." });
  }
});

app.listen(port, () => {
  console.log(`✅ Dummy Server running at http://localhost:${port}`);
});
