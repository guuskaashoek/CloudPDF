const express = require('express');
const router = express.Router();
const db = require('../database');

// GET /api/content/:docId — Retrieve document content
router.get('/:docId', (req, res) => {
    const { docId } = req.params;
    const doc = db.prepare('SELECT * FROM documents WHERE id = ?').get(docId);

    if (!doc) {
        return res.status(404).json({ error: 'Document not found' });
    }

    res.json({
        id: doc.id,
        content: doc.content,
        updated_at: doc.updated_at
    });
});

// POST /api/content/:docId — Update document content
router.post('/:docId', express.json(), (req, res) => {
    const { docId } = req.params;
    const { content } = req.body;

    const result = db.prepare(
        "UPDATE documents SET content = ?, updated_at = datetime('now') WHERE id = ?"
    ).run(content, docId);

    if (result.changes === 0) {
        return res.status(404).json({ error: 'Document not found' });
    }

    res.json({ success: true, message: 'Content updated' });
});

module.exports = router;
