import { MongoClient, GridFSBucket, ObjectId } from 'mongodb';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffprobeInstaller from '@ffprobe-installer/ffprobe';

// Set FFmpeg and FFprobe paths
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://basevibecoders_db_user:00Bh7MFd0oCNSvPb@cluster0.el7at0x.mongodb.net/';

// Location mapping for videos
const LOCATIONS = [
  {
    id: 'bali',
    name: 'Bali',
    country: 'Indonesia',
    coordinates: { lat: -8.3405, lng: 115.0920 },
    token: { symbol: 'BALI', price: 1.02, change24h: -5.5, volume: 158800, holders: 5000, marketCap: 5100000 }
  },
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    coordinates: { lat: 48.8566, lng: 2.3522 },
    token: { symbol: 'PARIS', price: 2.15, change24h: 8.2, volume: 234000, holders: 8900, marketCap: 19135000 }
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    coordinates: { lat: 35.6762, lng: 139.6503 },
    token: { symbol: 'TOKYO', price: 1.25, change24h: 67.8, volume: 425000, holders: 3400, marketCap: 4250000 }
  },
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'UAE',
    coordinates: { lat: 25.2048, lng: 55.2708 },
    token: { symbol: 'DUBAI', price: 1.82, change24h: 15.3, volume: 312000, holders: 6700, marketCap: 12194000 }
  },
  {
    id: 'newyork',
    name: 'New York',
    country: 'USA',
    coordinates: { lat: 40.7128, lng: -74.0060 },
    token: { symbol: 'NYC', price: 2.89, change24h: 34.2, volume: 587000, holders: 12100, marketCap: 34969000 }
  },
  {
    id: 'vegas',
    name: 'Las Vegas',
    country: 'USA',
    coordinates: { lat: 36.1699, lng: -115.1398 },
    token: { symbol: 'VEGAS', price: 1.78, change24h: 22.4, volume: 412000, holders: 8670, marketCap: 15430600 }
  }
];

const CATEGORIES = ['culture', 'nature', 'fun', 'food', 'shopping', 'nightlife', 'adventure'];
const CREATORS = [
  { id: 'creator1', username: '@travel_explorer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', xpPoints: 15420, totalEarnings: 2340.50 },
  { id: 'creator2', username: '@world_vibes', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka', xpPoints: 12300, totalEarnings: 1890.25 },
  { id: 'creator3', username: '@city_nights', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper', xpPoints: 22100, totalEarnings: 4567.80 },
  { id: 'creator4', username: '@luxury_travel', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna', xpPoints: 12800, totalEarnings: 1890.40 },
  { id: 'creator5', username: '@globe_explorer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chloe', xpPoints: 18900, totalEarnings: 3210.90 },
  { id: 'creator6', username: '@destination_vibes', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie', xpPoints: 9800, totalEarnings: 1450.20 }
];

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomElements(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateVideoMetadata(filename, locationIndex, actualDuration = 3) {
  const location = LOCATIONS[locationIndex % LOCATIONS.length];
  const creator = getRandomElement(CREATORS);
  const categories = getRandomElements(CATEGORIES, 3);
  
  return {
    videoId: `${location.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    locationId: location.id,
    locationName: location.name,
    country: location.country,
    coordinates: location.coordinates,
    creator,
    thumbnailUrl: `/placeholder.svg`,
    duration: actualDuration, // Use actual video duration
    views: Math.floor(Math.random() * 300000) + 50000,
    likes: Math.floor(Math.random() * 20000) + 5000,
    viralityScore: Math.floor(Math.random() * 30) + 70,
    token: location.token,
    bettingPool: Math.floor(Math.random() * 50000) + 25000,
    paidToPost: 0.10,
    categories,
    streamTags: [location.name, location.country],
    xpEarned: Math.floor(Math.random() * 800) + 200
  };
}

/**
 * Get video duration using FFprobe
 * @param {string} filePath - Video file path
 * @returns {Promise<number>} - Duration in seconds
 */
async function getVideoDuration(filePath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        console.log(`  Warning: Could not read duration for ${path.basename(filePath)}, using 3s default`);
        resolve(3);
      } else {
        resolve(metadata.format.duration || 3);
      }
    });
  });
}

async function uploadVideosToMongoDB() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('Connected to MongoDB!');
    
    const db = client.db('travelstreamz');
    const bucket = new GridFSBucket(db, { bucketName: 'videos' });
    const videosCollection = db.collection('videos');
    
    // Clear existing data
    console.log('Clearing existing data...');
    await videosCollection.deleteMany({});
    const existingFiles = await db.collection('videos.files').find({}).toArray();
    for (const file of existingFiles) {
      await bucket.delete(file._id);
    }
    console.log('Existing data cleared.');
    
    // Get all video files from public folder
    const publicPath = path.join(__dirname, '..', 'public');
    const files = fs.readdirSync(publicPath).filter(file => file.endsWith('_tiny.mp4'));
    
    console.log(`Found ${files.length} video files to upload`);
    
    let uploadedCount = 0;
    
    for (let i = 0; i < files.length; i++) {
      const filename = files[i];
      const filePath = path.join(publicPath, filename);
      
      console.log(`Uploading ${i + 1}/${files.length}: ${filename}`);
      
      try {
        // Read file
        const fileBuffer = fs.readFileSync(filePath);
        
        // Get actual video duration
        const duration = await getVideoDuration(filePath);
        const fileSizeMB = (fileBuffer.length / (1024 * 1024)).toFixed(2);
        
        console.log(`  Duration: ${duration.toFixed(2)}s, Size: ${fileSizeMB}MB`);
        
        // Generate metadata with actual duration
        const metadata = generateVideoMetadata(filename, i, duration);
        
        // Upload to GridFS
        const uploadStream = bucket.openUploadStream(filename, {
          contentType: 'video/mp4',
          metadata: {
            locationId: metadata.locationId,
            uploadedAt: new Date()
          }
        });
        
        await new Promise((resolve, reject) => {
          uploadStream.on('finish', resolve);
          uploadStream.on('error', reject);
          uploadStream.end(fileBuffer);
        });
        
        // Save video metadata
        await videosCollection.insertOne({
          ...metadata,
          filename,
          gridfsFileId: uploadStream.id,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        uploadedCount++;
        console.log(`✓ Uploaded: ${filename} (GridFS ID: ${uploadStream.id})`);
      } catch (error) {
        console.error(`✗ Error uploading ${filename}:`, error);
      }
    }
    
    console.log(`\n✅ Upload complete! ${uploadedCount}/${files.length} videos uploaded successfully.`);
    
    // Verify upload
    const count = await videosCollection.countDocuments();
    console.log(`Total videos in database: ${count}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('Connection closed.');
  }
}

// Run the upload
uploadVideosToMongoDB();
