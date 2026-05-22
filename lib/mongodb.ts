import mongoose, { type Mongoose } from "mongoose";

const MONGODB_URI: string = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable in .env.local",
  );
}

interface MongooseConnectionCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  var mongooseCache: MongooseConnectionCache | undefined;
}

// Persist the cache across hot reloads in development to avoid opening
// a new connection on every module reload.
const globalCache = globalThis as typeof globalThis & {
  mongooseCache?: MongooseConnectionCache;
};

const cached: MongooseConnectionCache = globalCache.mongooseCache ?? {
  conn: null,
  promise: null,
};

globalCache.mongooseCache = cached;

export async function connectToDatabase(): Promise<Mongoose> {
  // Reuse an existing connection whenever possible.
  if (cached.conn) {
    return cached.conn;
  }

  // Reuse an in-flight promise to prevent parallel connection attempts.
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    // Clear failed promise so the next call can retry the connection.
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectToDatabase;
