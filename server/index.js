const express = require('express');
const path = require('path');
const contentRoutes = require('./routes/content');
const generateRoutes = require('./routes/generate');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/content', contentRoutes);
app.use('/api/generate', generateRoutes);

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CloudPDF — Dynamic PDF Content Server</title>
  <meta name="description" content="Generate PDFs that dynamically fetch and display live data from a server using embedded Adobe Acrobat JavaScript.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    
    :root {
      --bg-primary: #0a0a0f;
      --bg-card: rgba(255, 255, 255, 0.04);
      --bg-card-hover: rgba(255, 255, 255, 0.07);
      --border-color: rgba(255, 255, 255, 0.08);
      --border-glow: rgba(99, 102, 241, 0.3);
      --text-primary: #f0f0f5;
      --text-secondary: #8b8b9e;
      --text-muted: #5a5a6e;
      --accent: #6366f1;
      --accent-light: #818cf8;
      --accent-glow: rgba(99, 102, 241, 0.15);
      --warning-bg: rgba(251, 191, 36, 0.08);
      --warning-border: rgba(251, 191, 36, 0.2);
      --warning-text: #fbbf24;
      --success: #34d399;
      --success-bg: rgba(52, 211, 153, 0.1);
      --error: #f87171;
      --radius: 16px;
      --radius-sm: 10px;
    }

    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      background: var(--bg-primary);
      color: var(--text-primary);
      min-height: 100vh;
      overflow-x: hidden;
    }

    /* Animated background gradient */
    body::before {
      content: '';
      position: fixed;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(ellipse at 30% 20%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
                  radial-gradient(ellipse at 70% 80%, rgba(139, 92, 246, 0.06) 0%, transparent 50%),
                  radial-gradient(ellipse at 50% 50%, rgba(59, 130, 246, 0.04) 0%, transparent 60%);
      animation: bgShift 20s ease-in-out infinite alternate;
      z-index: -1;
    }

    @keyframes bgShift {
      0% { transform: translate(0, 0) rotate(0deg); }
      100% { transform: translate(-5%, 3%) rotate(3deg); }
    }

    .container {
      max-width: 720px;
      margin: 0 auto;
      padding: 60px 24px 80px;
    }

    /* Header */
    .header {
      text-align: center;
      margin-bottom: 48px;
    }

    .header-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 64px;
      border-radius: 20px;
      background: linear-gradient(135deg, var(--accent), #8b5cf6);
      margin-bottom: 20px;
      font-size: 28px;
      box-shadow: 0 8px 32px rgba(99, 102, 241, 0.3);
      animation: float 4s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-6px); }
    }

    .header h1 {
      font-size: 32px;
      font-weight: 800;
      background: linear-gradient(135deg, var(--text-primary) 0%, var(--accent-light) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: -0.5px;
      margin-bottom: 8px;
    }

    .header p {
      color: var(--text-secondary);
      font-size: 15px;
      line-height: 1.6;
    }

    /* Warning banner */
    .warning {
      background: var(--warning-bg);
      border: 1px solid var(--warning-border);
      border-radius: var(--radius-sm);
      padding: 16px 20px;
      margin-bottom: 32px;
      display: flex;
      align-items: flex-start;
      gap: 12px;
      backdrop-filter: blur(10px);
    }

    .warning-icon {
      font-size: 18px;
      flex-shrink: 0;
      margin-top: 1px;
    }

    .warning-text {
      color: var(--warning-text);
      font-size: 13px;
      font-weight: 500;
      line-height: 1.5;
    }

    /* Step cards */
    .card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius);
      padding: 28px;
      margin-bottom: 20px;
      backdrop-filter: blur(20px);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    .card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.3), transparent);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .card:hover {
      background: var(--bg-card-hover);
      border-color: var(--border-glow);
      transform: translateY(-2px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(99, 102, 241, 0.1);
    }

    .card:hover::before {
      opacity: 1;
    }

    .step-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--accent-light);
      margin-bottom: 12px;
    }

    .step-number {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      border-radius: 6px;
      background: var(--accent-glow);
      font-size: 11px;
      font-weight: 700;
      color: var(--accent-light);
    }

    .card h2 {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 16px;
      letter-spacing: -0.3px;
    }

    /* Buttons */
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      font-size: 14px;
      font-weight: 600;
      font-family: inherit;
      border: none;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
      position: relative;
      overflow: hidden;
    }

    .btn-primary {
      background: linear-gradient(135deg, var(--accent), #8b5cf6);
      color: white;
      box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
    }

    .btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 24px rgba(99, 102, 241, 0.4);
    }

    .btn-primary:active {
      transform: translateY(0);
    }

    .btn-download {
      background: rgba(52, 211, 153, 0.1);
      color: var(--success);
      border: 1px solid rgba(52, 211, 153, 0.2);
      display: none;
    }

    .btn-download:hover {
      background: rgba(52, 211, 153, 0.15);
      box-shadow: 0 4px 16px rgba(52, 211, 153, 0.15);
    }

    .btn-download.visible {
      display: inline-flex;
      animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .btn-update {
      background: rgba(99, 102, 241, 0.1);
      color: var(--accent-light);
      border: 1px solid rgba(99, 102, 241, 0.2);
    }

    .btn-update:hover {
      background: rgba(99, 102, 241, 0.15);
      box-shadow: 0 4px 16px rgba(99, 102, 241, 0.15);
    }

    /* Status messages */
    .status {
      font-size: 13px;
      margin-top: 12px;
      padding: 8px 12px;
      border-radius: 8px;
      display: none;
      animation: fadeIn 0.3s ease;
    }

    .status.visible {
      display: block;
    }

    .status.loading {
      color: var(--accent-light);
      background: var(--accent-glow);
    }

    .status.success {
      color: var(--success);
      background: var(--success-bg);
    }

    .status.error {
      color: var(--error);
      background: rgba(248, 113, 113, 0.1);
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    /* Textarea */
    .textarea-wrapper {
      position: relative;
      margin-bottom: 16px;
    }

    textarea {
      width: 100%;
      padding: 14px 16px;
      font-size: 14px;
      font-family: inherit;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      color: var(--text-primary);
      resize: vertical;
      min-height: 100px;
      transition: all 0.2s ease;
      line-height: 1.6;
    }

    textarea::placeholder {
      color: var(--text-muted);
    }

    textarea:focus {
      outline: none;
      border-color: var(--accent);
      box-shadow: 0 0 0 3px var(--accent-glow);
      background: rgba(255, 255, 255, 0.05);
    }

    /* Current content display */
    .current-content {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid var(--border-color);
    }

    .current-content-label {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--text-muted);
      margin-bottom: 8px;
    }

    .current-content-value {
      font-size: 14px;
      color: var(--text-secondary);
      line-height: 1.6;
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.02);
      border-radius: 8px;
      border: 1px dashed var(--border-color);
    }

    /* Loading spinner */
    .spinner {
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      border-top-color: currentColor;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Footer */
    .footer {
      text-align: center;
      margin-top: 48px;
      color: var(--text-muted);
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-icon">☁️</div>
      <h1>CloudPDF</h1>
      <p>Generate PDFs that dynamically fetch and display live data from your server</p>
    </div>

    <div class="warning">
      <span class="warning-icon">⚠️</span>
      <span class="warning-text">
        <strong>Important:</strong> The generated PDF only works in Adobe Acrobat Reader (Desktop). 
        Browser-based PDF viewers (Chrome, Firefox, Edge) do not support embedded JavaScript.
      </span>
    </div>

    <div class="card">
      <div class="step-badge">
        <span class="step-number">1</span>
        Generate
      </div>
      <h2>Generate Live PDF</h2>
      <button class="btn btn-primary" onclick="generatePDF()" id="btnGenerate">
        <span>⚡</span> Generate PDF
      </button>
      <div class="status" id="genStatus"></div>
    </div>

    <div class="card">
      <div class="step-badge">
        <span class="step-number">2</span>
        Download
      </div>
      <h2>Download &amp; Open in Acrobat</h2>
      <a id="downloadLink" class="btn btn-download" href="#" download>
        <span>📥</span> Download PDF
      </a>
      <p id="downloadHint" style="color: var(--text-muted); font-size: 13px;">
        Generate a PDF first using the button above
      </p>
    </div>

    <div class="card">
      <div class="step-badge">
        <span class="step-number">3</span>
        Update
      </div>
      <h2>Update Content in Database</h2>
      <div class="textarea-wrapper">
        <textarea id="newContent" placeholder="Type new content here that will appear in the PDF..."></textarea>
      </div>
      <button class="btn btn-update" onclick="updateContent()">
        <span>🔄</span> Update Database
      </button>
      <div class="status" id="updateStatus"></div>

      <div class="current-content">
        <div class="current-content-label">Current content in database</div>
        <div class="current-content-value" id="currentContent">Loading...</div>
      </div>
    </div>

    <div class="footer">
      CloudPDF &mdash; Dynamic PDF Content Server
    </div>
  </div>

  <script>
    // Load current content on page load
    async function loadCurrentContent() {
      try {
        const res = await fetch('/api/content/doc-001');
        const data = await res.json();
        document.getElementById('currentContent').textContent = data.content;
      } catch(e) {
        document.getElementById('currentContent').textContent = 'Failed to load content';
      }
    }

    function setStatus(elementId, message, type) {
      const el = document.getElementById(elementId);
      el.className = 'status visible ' + type;
      el.innerHTML = type === 'loading' 
        ? '<span class="spinner"></span> ' + message 
        : message;
    }

    async function generatePDF() {
      const btn = document.getElementById('btnGenerate');
      btn.disabled = true;
      setStatus('genStatus', 'Generating PDF...', 'loading');
      
      try {
        const res = await fetch('/api/generate/doc-001');
        const data = await res.json();
        if (data.success) {
          setStatus('genStatus', '✓ PDF generated successfully!', 'success');
          const link = document.getElementById('downloadLink');
          link.href = data.downloadUrl;
          link.classList.add('visible');
          document.getElementById('downloadHint').style.display = 'none';
        }
      } catch(e) {
        setStatus('genStatus', '✗ Error: ' + e.message, 'error');
      } finally {
        btn.disabled = false;
      }
    }
    
    async function updateContent() {
      const content = document.getElementById('newContent').value;
      if (!content) {
        setStatus('updateStatus', '✗ Please enter new content first', 'error');
        return;
      }
      
      setStatus('updateStatus', 'Updating content...', 'loading');
      
      try {
        const res = await fetch('/api/content/doc-001', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content })
        });
        const data = await res.json();
        if (data.success) {
          setStatus('updateStatus', '✓ Database updated! Click "Fetch Content" in the PDF to see the change.', 'success');
          document.getElementById('currentContent').textContent = content;
          document.getElementById('newContent').value = '';
        } else {
          setStatus('updateStatus', '✗ Error: ' + data.error, 'error');
        }
      } catch(e) {
        setStatus('updateStatus', '✗ Error: ' + e.message, 'error');
      }
    }

    loadCurrentContent();
  </script>
</body>
</html>`);
});

app.listen(PORT, () => {
  console.log(`CloudPDF server running at http://localhost:${PORT}`);
});
