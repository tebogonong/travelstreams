import { MongoClient, Db, GridFSBucket } from 'mongodb';

const MONGODB_URI = import.meta.env.VITE_MONGODB_URI || '';

if (!MONGODB_URI) {
  throw new Error('Please define the VITE_MONGODB_URI environment variable inside .env');
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;
let cachedBucket: GridFSBucket | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb, bucket: cachedBucket! };
  }

  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db('travelstreamz');
  const bucket = new GridFSBucket(db, { bucketName: 'videos' });

  cachedClient = client;
  cachedDb = db;
  cachedBucket = bucket;

  return { client, db, bucket };
}

export async function getDatabase() {
  const { db } = await connectToDatabase();
  return db;
}

export async function getGridFSBucket() {
  const { bucket } = await connectToDatabase();
  return bucket;
}
