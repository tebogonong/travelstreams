import express from 'express';
import cors from 'cors';
import { MongoClient, GridFSBucket, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import compression from 'compression';

dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;

// Enable compression for all responses
app.use(compression({
  level: 6, // Balance between speed and compression
  threshold: 1024 // Only compress responses larger than 1KB
}));

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Range'],
  exposedHeaders: ['Content-Range', 'Accept-Ranges', 'Content-Length']
}));

app.use(express.json());

let client;
let db;
let bucket;

// Connect to MongoDB
async function connectDB() {
  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db('travelstreamz');
    bucket = new GridFSBucket(db, { bucketName: 'videos' });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Get all videos
app.get('/api/videos', async (req, res) => {
  try {
    const videos = await db.collection('videos').find({}).toArray();
    
    const videosWithUrls = videos.map(video => ({
      id: video.videoId,
      videoUrl: `http://localhost:${PORT}/api/videos/stream/${video.gridfsFileId}`,
      location: {
        id: video.locationId,
        name: video.locationName,
        country: video.country,
        coordinates: video.coordinates
      },
      creator: video.creator,
      thumbnailUrl: video.thumbnailUrl,
      duration: video.duration,
      views: video.views,
      likes: video.likes,
      viralityScore: video.viralityScore,
      token: video.token,
      bettingPool: video.bettingPool,
      paidToPost: video.paidToPost,
      categories: video.categories,
      streamTags: video.streamTags,
      xpEarned: video.xpEarned,
      createdAt: video.createdAt
    }));
    
    // Add caching headers for video list
    res.set('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes
    res.json(videosWithUrls);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// Get videos by location
app.get('/api/videos/location/:locationId', async (req, res) => {
  try {
    const { locationId } = req.params;
    const videos = await db.collection('videos').find({ locationId }).toArray();
    
    const videosWithUrls = videos.map(video => ({
      id: video.videoId,
      videoUrl: `http://localhost:${PORT}/api/videos/stream/${video.gridfsFileId}`,
      location: {
        id: video.locationId,
        name: video.locationName,
        country: video.country,
        coordinates: video.coordinates
      },
      creator: video.creator,
      thumbnailUrl: video.thumbnailUrl,
      duration: video.duration,
      views: video.views,
      likes: video.likes,
      viralityScore: video.viralityScore,
      token: video.token,
      bettingPool: video.bettingPool,
      paidToPost: video.paidToPost,
      categories: video.categories,
      streamTags: video.streamTags,
      xpEarned: video.xpEarned,
      createdAt: video.createdAt
    }));
    
    res.json(videosWithUrls);
  } catch (error) {
    console.error('Error fetching videos by location:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// Stream video with range support (for seeking and progressive loading)
app.get('/api/videos/stream/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    
    if (!ObjectId.isValid(fileId)) {
      return res.status(400).json({ error: 'Invalid file ID' });
    }
    
    // Get file info
    const fileInfo = await db.collection('videos.files').findOne({ _id: new ObjectId(fileId) });
    
    if (!fileInfo) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    const fileSize = fileInfo.length;
    const range = req.headers.range;
    
    // Support range requests for progressive loading
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = (end - start) + 1;
      
      // Open download stream with range
      const downloadStream = bucket.openDownloadStream(new ObjectId(fileId), {
        start: start,
        end: end + 1
      });
      
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/mp4',
        'Cache-Control': 'public, max-age=31536000, immutable'
      });
      
      downloadStream.pipe(res);
      
      downloadStream.on('error', (error) => {
        console.error('Stream error:', error);
        if (!res.headersSent) {
          res.status(500).end();
        }
      });
      
    } else {
      // Full file download
      const downloadStream = bucket.openDownloadStream(new ObjectId(fileId));
      
      res.writeHead(200, {
        'Content-Type': 'video/mp4',
        'Content-Length': fileSize,
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=31536000, immutable'
      });
      
      downloadStream.pipe(res);
      
      downloadStream.on('error', (error) => {
        console.error('Stream error:', error);
        if (!res.headersSent) {
          res.status(500).end();
        }
      });
    }
  } catch (error) {
    console.error('Error streaming video:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to stream video' });
    }
  }
});

// Start server
async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
  });
}

startServer();
