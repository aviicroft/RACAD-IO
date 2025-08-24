import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/college-chatbot'

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */

// Extend global to include mongoose
declare global {
  var mongoose: {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  } | undefined
}

// Initialize the cache
if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  if (global.mongoose!.conn) {
    return global.mongoose!.conn
  }

  if (!global.mongoose!.promise) {
    (global.mongoose as any).promise = mongoose.connect(MONGODB_URI, { bufferCommands: false })
  }

  try {
    global.mongoose!.conn = await global.mongoose!.promise
  } catch (e) {
    global.mongoose!.promise = null
    throw e
  }

  return global.mongoose!.conn
}

export default dbConnect
