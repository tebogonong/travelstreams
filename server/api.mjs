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

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('🏥 Health check requested');
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    mongodb: db ? 'connected' : 'disconnected',
    uptime: process.uptime()
  });
});

// Connect to MongoDB
async function connectDB() {
  try {
    console.log('🔌 Attempting to connect to MongoDB...');
    console.log('📍 URI:', MONGODB_URI ? MONGODB_URI.replace(/:[^:]*@/, ':****@') : 'UNDEFINED');
    
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    db = client.db('travelstreamz');
    bucket = new GridFSBucket(db, { bucketName: 'videos' });
    
    // Test the connection by pinging
    await db.admin().ping();
    
    console.log('✅ Connected to MongoDB successfully');
    console.log('📦 Database: travelstreamz');
    console.log('🎬 GridFS Bucket: videos');
    
    // Log collection stats
    const videoCount = await db.collection('videos').countDocuments();
    const fileCount = await db.collection('videos.files').countDocuments();
    console.log(`📹 Videos in collection: ${videoCount}`);
    console.log(`📁 Files in GridFS: ${fileCount}`);
    
  } catch (error) {
    console.error('❌ MongoDB connection error:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('\n💡 Troubleshooting tips:');
    console.error('1. Check if MONGODB_URI is set in .env file');
    console.error('2. Verify MongoDB Atlas cluster is running');
    console.error('3. Check network/firewall settings');
    console.error('4. Ensure IP address is whitelisted in MongoDB Atlas');
    process.exit(1);
  }
}

// Get all videos
app.get('/api/videos', async (req, res) => {
  try {
    console.log('📥 GET /api/videos - Fetching all videos');
    const startTime = Date.now();
    
    const videos = await db.collection('videos').find({}).toArray();
    
    console.log(`✅ Found ${videos.length} videos in ${Date.now() - startTime}ms`);
    
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
    
    console.log(`📤 Sent ${videosWithUrls.length} videos to client`);
  } catch (error) {
    console.error('❌ Error fetching videos:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to fetch videos',
      message: error.message,
      timestamp: new Date().toISOString()
    });
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
    
    console.log(`🎬 Streaming video: ${fileId}`);
    
    if (!ObjectId.isValid(fileId)) {
      console.error(`❌ Invalid file ID: ${fileId}`);
      return res.status(400).json({ error: 'Invalid file ID' });
    }
    
    // Get file info
    const fileInfo = await db.collection('videos.files').findOne({ _id: new ObjectId(fileId) });
    
    if (!fileInfo) {
      console.error(`❌ Video not found in GridFS: ${fileId}`);
      return res.status(404).json({ error: 'Video not found' });
    }
    
    console.log(`✅ Found video: ${fileInfo.filename} (${(fileInfo.length / 1024 / 1024).toFixed(2)}MB)`);
    
    const fileSize = fileInfo.length;
    const range = req.headers.range;
    
    // Support range requests for progressive loading
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = (end - start) + 1;
      
      console.log(`📦 Range request: ${start}-${end}/${fileSize} (${(chunkSize / 1024).toFixed(1)}KB)`);
      
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
        console.error(`❌ Stream error (range):`, error.message);
        if (!res.headersSent) {
          res.status(500).end();
        }
      });
      
    } else {
      console.log(`📦 Full file request: ${(fileSize / 1024 / 1024).toFixed(2)}MB`);
      
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
        console.error(`❌ Stream error (full):`, error.message);
        if (!res.headersSent) {
          res.status(500).end();
        }
      });
    }
  } catch (error) {
    console.error('❌ Error streaming video:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Failed to stream video',
        message: error.message 
      });
    }
  }
});

// Start server
async function startServer() {
  try {
    console.log('🚀 Starting API server...');
    console.log('📍 Port:', PORT);
    console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
    
    await connectDB();
    
    const server = app.listen(PORT, () => {
      console.log('✅ API server running successfully');
      console.log(`🌐 Local: http://localhost:${PORT}`);
      console.log(`🔗 Videos endpoint: http://localhost:${PORT}/api/videos`);
      console.log('⏳ Waiting for requests...\n');
    });
    
    // Handle server errors
    server.on('error', (error) => {
      console.error('❌ Server error:');
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      if (error.code === 'EADDRINUSE') {
        console.error(`\n💡 Port ${PORT} is already in use.`);
        console.error('Solutions:');
        console.error(`1. Kill the process using port ${PORT}`);
        console.error('2. Use a different port in .env file');
        console.error('3. Run: Get-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess | Stop-Process -Force');
      }
      
      process.exit(1);
    });
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n🛑 Shutting down gracefully...');
      server.close(() => {
        console.log('✅ Server closed');
      });
      if (client) {
        await client.close();
        console.log('✅ MongoDB connection closed');
      }
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    process.exit(1);
  }
}

startServer();
