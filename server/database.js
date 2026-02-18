const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'content.db'));

// Initialize database with documents table and seed data
db.exec(`
  CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY,
    content TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  INSERT OR REPLACE INTO documents (id, content) 
  VALUES ('doc-001', 'This is the original content from the database!');
`);

module.exports = db;
