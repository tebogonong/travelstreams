import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function checkDatabase() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('🔍 Checking MongoDB Database...\n');
    await client.connect();
    
    const db = client.db('travelstreamz');
    const videosCollection = db.collection('videos');
    const filesCollection = db.collection('videos.files');
    
    // Get video count
    const videoCount = await videosCollection.countDocuments();
    console.log(`📊 Total videos in database: ${videoCount}\n`);
    
    // Get first 5 videos with details
    const videos = await videosCollection.find({}).limit(10).toArray();
    
    console.log('📹 Sample Videos (First 10):');
    console.log('='.repeat(80));
    
    videos.forEach((video, index) => {
      console.log(`\n${index + 1}. ${video.locationName} (${video.filename})`);
      console.log(`   Duration: ${video.duration.toFixed(2)}s`);
      console.log(`   GridFS ID: ${video.gridfsFileId}`);
      console.log(`   Created: ${video.createdAt.toISOString()}`);
    });
    
    // Get file sizes from GridFS
    console.log('\n\n📦 GridFS File Sizes:');
    console.log('='.repeat(80));
    
    const files = await filesCollection.find({}).limit(10).toArray();
    let totalSize = 0;
    
    files.forEach((file, index) => {
      const sizeMB = (file.length / (1024 * 1024)).toFixed(2);
      totalSize += file.length;
      console.log(`${index + 1}. ${file.filename}`);
      console.log(`   Size: ${sizeMB}MB`);
      console.log(`   Upload: ${file.uploadDate.toISOString()}`);
    });
    
    // Get total storage
    const allFiles = await filesCollection.find({}).toArray();
    const totalStorage = allFiles.reduce((sum, file) => sum + file.length, 0);
    const totalStorageMB = (totalStorage / (1024 * 1024)).toFixed(2);
    
    console.log('\n\n📈 Summary:');
    console.log('='.repeat(80));
    console.log(`Total videos: ${videoCount}`);
    console.log(`Total storage: ${totalStorageMB}MB`);
    console.log(`Average size: ${(totalStorage / videoCount / (1024 * 1024)).toFixed(2)}MB per video`);
    
    // Check if durations are all 3 seconds
    const allVideos = await videosCollection.find({}).toArray();
    const durationsUnder4 = allVideos.filter(v => v.duration <= 4).length;
    const durationsExactly3 = allVideos.filter(v => Math.abs(v.duration - 3) < 0.1).length;
    
    console.log(`\n✅ Videos with duration ≤ 4s: ${durationsUnder4}/${videoCount} (${((durationsUnder4/videoCount)*100).toFixed(1)}%)`);
    console.log(`✅ Videos with duration ≈ 3s: ${durationsExactly3}/${videoCount} (${((durationsExactly3/videoCount)*100).toFixed(1)}%)`);
    
    if (durationsExactly3 === videoCount) {
      console.log('\n🎉 SUCCESS! All videos are optimized to 3 seconds!');
    } else {
      console.log('\n⚠️  Some videos may not be fully optimized.');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

checkDatabase();
