import { getDatabase, getGridFSBucket } from '../lib/mongodb';
import { VideoDocument, VideoResponse } from '../types/database';
import { ObjectId } from 'mongodb';

const VIDEOS_COLLECTION = 'videos';

export class VideoService {
  static async getAllVideos(): Promise<VideoResponse[]> {
    try {
      const db = await getDatabase();
      const videos = await db
        .collection<VideoDocument>(VIDEOS_COLLECTION)
        .find({})
        .toArray();

      return videos.map(video => this.transformVideoDocument(video));
    } catch (error) {
      console.error('Error fetching videos from database:', error);
      throw error;
    }
  }

  static async getVideosByLocation(locationId: string): Promise<VideoResponse[]> {
    try {
      const db = await getDatabase();
      const videos = await db
        .collection<VideoDocument>(VIDEOS_COLLECTION)
        .find({ locationId })
        .toArray();

      return videos.map(video => this.transformVideoDocument(video));
    } catch (error) {
      console.error(`Error fetching videos for location ${locationId}:`, error);
      throw error;
    }
  }

  static async getVideoStream(gridfsFileId: string): Promise<string> {
    // Return the API endpoint that will stream the video
    return `/api/videos/stream/${gridfsFileId}`;
  }

  private static transformVideoDocument(doc: VideoDocument): VideoResponse {
    return {
      id: doc.videoId,
      videoUrl: `/api/videos/stream/${doc.gridfsFileId.toString()}`,
      location: {
        id: doc.locationId,
        name: doc.locationName,
        country: doc.country,
        coordinates: doc.coordinates
      },
      creator: doc.creator,
      thumbnailUrl: doc.thumbnailUrl,
      duration: doc.duration,
      views: doc.views,
      likes: doc.likes,
      viralityScore: doc.viralityScore,
      token: doc.token,
      bettingPool: doc.bettingPool,
      paidToPost: doc.paidToPost,
      categories: doc.categories,
      streamTags: doc.streamTags,
      xpEarned: doc.xpEarned,
      createdAt: doc.createdAt
    };
  }

  static async uploadVideo(
    filename: string,
    fileBuffer: Buffer,
    metadata: Omit<VideoDocument, '_id' | 'filename' | 'gridfsFileId' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    try {
      const db = await getDatabase();
      const bucket = await getGridFSBucket();

      // Upload file to GridFS
      const uploadStream = bucket.openUploadStream(filename, {
        contentType: 'video/mp4',
        metadata: {
          locationId: metadata.locationId,
          uploadedAt: new Date()
        }
      });

      return new Promise((resolve, reject) => {
        uploadStream.on('finish', async () => {
          try {
            // Save video metadata to videos collection
            const videoDoc: Omit<VideoDocument, '_id'> = {
              ...metadata,
              filename,
              gridfsFileId: uploadStream.id as ObjectId,
              createdAt: new Date(),
              updatedAt: new Date()
            };

            await db.collection(VIDEOS_COLLECTION).insertOne(videoDoc);
            resolve(uploadStream.id.toString());
          } catch (error) {
            reject(error);
          }
        });

        uploadStream.on('error', reject);
        uploadStream.end(fileBuffer);
      });
    } catch (error) {
      console.error('Error uploading video:', error);
      throw error;
    }
  }
}
