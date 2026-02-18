# ☁️ CloudPDF

**Generate PDFs that dynamically fetch and display live data from a server.**

CloudPDF is a proof-of-concept that demonstrates how a locally downloaded PDF can connect to a remote server, fetch the latest content, and update itself in real-time — all using embedded Adobe Acrobat JavaScript.

---

## ✨ Features

- **Dynamic PDF Content** — Generated PDFs fetch live data from the server on demand
- **Server-Side Control** — Update PDF content by changing a value in the database, no need to regenerate
- **Web Dashboard** — Simple UI to generate PDFs and manage content
- **Embedded JavaScript** — Uses Adobe Acrobat's built-in JS engine for HTTP requests
- **SQLite Storage** — Lightweight database, zero configuration

## 🏗️ How It Works

```
┌────────────────────┐         ┌──────────────────┐         ┌──────────────┐
│   Web Dashboard    │────────▶│  Express Server   │────────▶│   SQLite DB  │
│  (Generate & Edit) │         │  (API + PDF Gen)  │         │  (Content)   │
└────────────────────┘         └──────────────────┘         └──────────────┘
                                       ▲
                                       │ HTTP Request
                                       │ (Net.HTTP.request)
                               ┌───────┴────────┐
                               │  PDF in Adobe   │
                               │ Acrobat Reader  │
                               └────────────────┘
```

1. **Generate** a PDF via the web dashboard — the server creates a PDF with embedded JavaScript
2. **Download** the PDF and open it in Adobe Acrobat Reader
3. **Click "Fetch Content"** inside the PDF — it calls the server API and displays fresh data
4. **Update content** via the web dashboard — change what the PDF shows without regenerating it

## 📋 Prerequisites

| Requirement | Details |
|---|---|
| **Node.js** | v18 or higher |
| **Adobe Acrobat Reader** | Desktop version (DC or later) — **required** to open the PDF |

> [!IMPORTANT]
> Browser PDF viewers (Chrome, Firefox, Edge, Safari) **do not** support embedded JavaScript. You **must** use Adobe Acrobat Reader Desktop to use the live update feature.

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/your-username/cloudpdf.git
cd cloudpdf

# Install dependencies
npm install

# Start the server
npm start
```

Open **http://localhost:3000** in your browser to access the dashboard.

## ⚙️ Adobe Acrobat Configuration

Adobe Acrobat blocks network requests from PDFs by default. You need to allow it:

### Option A: Add Trusted URL (Recommended)

1. Open Adobe Acrobat Reader
2. Go to **Edit → Preferences → Security (Enhanced)**
3. Under **Privileged Locations**, click **"Add URL"**
4. Enter: `http://localhost:3000`
5. Click **OK** and restart Acrobat

### Option B: Add Trusted Folder

1. Go to **Edit → Preferences → Security (Enhanced)**
2. Under **Privileged Locations**, click **"Add Folder Path"**
3. Select the folder where you save downloaded PDFs
4. Click **OK** and restart Acrobat

### Option C: Disable Enhanced Security (Development Only)

> [!CAUTION]
> Only use this for local development. Do not disable enhanced security on production machines.

1. Go to **Edit → Preferences → Security (Enhanced)**
2. Uncheck **"Enable Enhanced Security"**
3. Click **OK** and restart Acrobat

## 📁 Project Structure

```
cloudpdf/
├── server/
│   ├── index.js              # Express server + web dashboard UI
│   ├── database.js           # SQLite database setup + seed data
│   ├── routes/
│   │   ├── content.js        # API: GET/POST document content
│   │   └── generate.js       # API: PDF generation with embedded JS
│   └── public/
│       └── downloads/        # Generated PDF files (gitignored)
├── package.json
├── .gitignore
├── LICENSE
└── README.md
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/content/:docId` | Retrieve document content |
| `POST` | `/api/content/:docId` | Update document content |
| `GET` | `/api/generate/:docId` | Generate a PDF with embedded JS |

### Example

```bash
# Get current content
curl http://localhost:3000/api/content/doc-001

# Update content
curl -X POST http://localhost:3000/api/content/doc-001 \
  -H "Content-Type: application/json" \
  -d '{"content": "Hello from CloudPDF!"}'

# Generate PDF
curl http://localhost:3000/api/generate/doc-001
```

## 🛠️ Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/)
- **Server**: [Express](https://expressjs.com/)
- **Database**: [SQLite](https://www.sqlite.org/) via [better-sqlite3](https://github.com/WiseLibs/better-sqlite3)
- **PDF Generation**: [pdf-lib](https://pdf-lib.js.org/)
- **PDF JavaScript**: [Adobe Acrobat JavaScript API](https://opensource.adobe.com/dc-acrobat-sdk-docs/acrobatsdk/)

## 📄 License

MIT — see [LICENSE](LICENSE) for details.
