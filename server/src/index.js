import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { getCatalog, createBooking, pay } from './core.js';

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(express.json({ limit: '50kb' }));

app.get('/api/services', (_req, res) => res.json(getCatalog()));

app.post('/api/bookings', (req, res) => {
  const { status, data } = createBooking(req.body);
  res.status(status).json(data);
});

app.post('/api/payments/mock', async (req, res, next) => {
  try {
    const { status, data } = await pay(req.body);
    res.status(status).json(data);
  } catch (err) {
    next(err);
  }
});

// Serve the built React app when it exists (single-server production run)
const dist = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get(/^(?!\/api).*/, (_req, res) => res.sendFile(path.join(dist, 'index.html')));
}

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong. Please try again.' });
});

app.listen(PORT, () => console.log(`Helppora server running on http://localhost:${PORT}`));
