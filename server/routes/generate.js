const express = require('express');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// CORS headers for cross-origin requests
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// GET /api/generate/:docId — Generate a PDF with embedded live-update JavaScript
router.get('/:docId', async (req, res) => {
  const { docId } = req.params;
  const serverUrl = `http://localhost:3000`;

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Title and instructions
  page.drawText('CloudPDF — Live Update Demo', {
    x: 50, y: 720, size: 24, font: boldFont
  });

  page.drawText('This document only works in Adobe Acrobat Reader (Desktop)', {
    x: 50, y: 680, size: 10, font: font, color: rgb(1, 0, 0)
  });

  page.drawText('Click the "Fetch Content" button below to retrieve the latest content from the server', {
    x: 50, y: 660, size: 10, font: font
  });

  // Interactive form fields
  const form = pdfDoc.getForm();

  const contentField = form.createTextField('dynamicContent');
  contentField.setText('Click "Fetch Content" to load data from the server...');
  contentField.addToPage(page, {
    x: 50, y: 450, width: 500, height: 120,
    borderColor: rgb(0, 0, 0), borderWidth: 1, backgroundColor: rgb(0.95, 0.95, 0.95)
  });
  contentField.enableMultiline();
  contentField.setFontSize(12);

  const updateField = form.createTextField('lastUpdate');
  updateField.setText('Never updated');
  updateField.addToPage(page, { x: 50, y: 380, width: 300, height: 25 });

  const statusField = form.createTextField('status');
  statusField.setText('Ready');
  statusField.addToPage(page, { x: 370, y: 380, width: 180, height: 25 });

  // Embedded JavaScript for Adobe Acrobat
  const script = `
    var serverUrl = "${serverUrl}";
    var docId = "${docId}";
    
    function fetchContent() {
      try {
        this.getField("status").value = "Loading...";
        
        var cURL = serverUrl + "/api/content/" + docId;
        var stream = Net.HTTP.request({ cURL: cURL, cVerb: "GET" });
        
        // Net.HTTP.request returns a stream, not a string
        var responseText;
        if (typeof stream === "string") {
          responseText = stream;
        } else {
          responseText = SOAP.stringFromStream(stream);
        }
        
        // Parse the JSON response
        var data = eval("(" + responseText + ")");
        
        this.getField("dynamicContent").value = data.content;
        this.getField("lastUpdate").value = data.updated_at;
        this.getField("status").value = "Updated successfully";
        
        app.alert("Content updated!\\nNew content: " + data.content);
        
      } catch(e) {
        this.getField("status").value = "Error: " + e.message;
        app.alert("Failed to fetch content: " + e.message + "\\nMake sure the server is running at " + serverUrl);
      }
    }
    
    // Fetch Content button
    var btnFetch = this.addField("btnFetch", "button", 0, [50, 300, 200, 330]);
    btnFetch.buttonSetCaption("Fetch Content");
    btnFetch.fillColor = color.ltGray;
    btnFetch.setAction("MouseUp", "fetchContent();");
    
    // Test Script button
    var btnTest = this.addField("btnTest", "button", 0, [220, 300, 350, 330]);
    btnTest.buttonSetCaption("Test Script");
    btnTest.setAction("MouseUp", "app.alert('JavaScript is working! Document ID: " + docId + "');");
  `;

  pdfDoc.addJavaScript('CloudPDFScript', script);

  const pdfBytes = await pdfDoc.save();
  const fileName = `cloudpdf-${docId}.pdf`;
  const filePath = path.join(__dirname, '../public/downloads', fileName);

  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
  }

  fs.writeFileSync(filePath, pdfBytes);

  res.json({
    success: true,
    downloadUrl: `/downloads/${fileName}`,
    message: 'PDF generated successfully'
  });
});

module.exports = router;
