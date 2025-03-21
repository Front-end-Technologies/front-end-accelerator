// serving the dist folder

import express from 'express';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
console.log('__filename: ', __filename);
const __dirname = dirname(__filename);

const app = express();
const port = process.env['PORT'] || 3000;

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'webcontainerbuild')));

// Send all requests to the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'webcontainerbuild', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
