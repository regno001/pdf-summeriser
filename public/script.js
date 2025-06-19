document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const fileInput = document.getElementById("pdfFile");
  const summaryBox = document.getElementById("summary");

  const formData = new FormData();
  formData.append("pdfFile", fileInput.files[0]);

  summaryBox.textContent = "Processing...";

  try {
    const res = await fetch("/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    summaryBox.textContent = data.summary || "No summary generated.";
  } catch (err) {
    summaryBox.textContent = "❌ Failed to summarize PDF.";
  }
});
