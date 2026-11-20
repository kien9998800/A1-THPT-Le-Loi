import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));

app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

const BLOGS_FILE_SRC = path.join(process.cwd(), 'blogs.json');
const LOICHUC_FILE_SRC = path.join(process.cwd(), 'loichuc.json');

// In production (Cloud Run), process.cwd() is read-only, so we must write to /tmp
const BLOGS_FILE = process.env.NODE_ENV === 'production' ? path.join('/tmp', 'blogs.json') : BLOGS_FILE_SRC;
const LOICHUC_FILE = process.env.NODE_ENV === 'production' ? path.join('/tmp', 'loichuc.json') : LOICHUC_FILE_SRC;

// Initialize blogs.json if it doesn't exist
if (!fs.existsSync(BLOGS_FILE)) {
  if (process.env.NODE_ENV === 'production' && fs.existsSync(BLOGS_FILE_SRC)) {
    fs.copyFileSync(BLOGS_FILE_SRC, BLOGS_FILE);
  } else {
    fs.writeFileSync(BLOGS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

// Initialize loichuc.json if it doesn't exist
if (!fs.existsSync(LOICHUC_FILE)) {
  if (process.env.NODE_ENV === 'production' && fs.existsSync(LOICHUC_FILE_SRC)) {
    fs.copyFileSync(LOICHUC_FILE_SRC, LOICHUC_FILE);
  } else {
    fs.writeFileSync(LOICHUC_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

app.get('/api/blogs', (req, res) => {
  try {
    const data = fs.readFileSync(BLOGS_FILE, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Failed to read blogs' });
  }
});

app.post('/api/blogs', (req, res) => {
  try {
    const blogs = req.body;
    fs.writeFileSync(BLOGS_FILE, JSON.stringify(blogs, null, 2), 'utf-8');
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to write blogs' });
  }
});

app.get('/api/messages', (req, res) => {
  try {
    const data = fs.readFileSync(LOICHUC_FILE, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Failed to read messages' });
  }
});

app.post('/api/messages', (req, res) => {
  try {
    const messages = req.body;
    fs.writeFileSync(LOICHUC_FILE, JSON.stringify(messages, null, 2), 'utf-8');
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to write messages' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
