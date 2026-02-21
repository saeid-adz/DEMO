import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { readdir } from 'fs/promises';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
app.use(cors());
app.use(express.json());

// Path to the mounted Windows share
const PHOTO_SHARE_PATH = process.env.PHOTO_SHARE_PATH || '/mnt/photo';

// Serve static files from the photo share
app.use('/photos', express.static(PHOTO_SHARE_PATH));

// API endpoint to list all images
app.get('/api/gallery', async (req, res) => {
  try {
    const files = await readdir(PHOTO_SHARE_PATH);
    
    // Filter for image files only
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
    const images = files
      .filter(file => imageExtensions.includes(extname(file).toLowerCase()))
      .map(file => ({
        name: file,
        url: `/photos/${file}`,
        thumbnail: `/photos/${file}` // You can add thumbnail generation later
      }));
    
    res.json({ success: true, images, count: images.length });
  } catch (error) {
    console.error('Error reading photo directory:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to read photo directory',
      message: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', photoPath: PHOTO_SHARE_PATH });
});

app.listen(PORT, () => {
  console.log(`Gallery API server running on port ${PORT}`);
  console.log(`Photo share path: ${PHOTO_SHARE_PATH}`);
});
