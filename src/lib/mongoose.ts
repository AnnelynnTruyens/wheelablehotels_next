import mongoose, { Mongoose } from "mongoose";

// Validate env var at runtime
const MONGODB_CONNECTION = process.env.MONGODB_CONNECTION;

if (!MONGODB_CONNECTION) {
	throw new Error("Please define the MONGODB_CONNECTION environment variable");
}

// Extend globalThis directly, using module augmentation
declare global {
	interface Global {
		mongoose: {
			conn: Mongoose | null;
			promise: Promise<Mongoose> | null;
		};
	}
}

// Use globalThis to stay modern (not `global`)
const globalWithMongoose = globalThis as typeof globalThis & {
	mongoose?: { conn: Mongoose | null; promise: Promise<Mongoose> | null };
};

export async function connectToDatabase(): Promise<Mongoose> {
	if (!globalWithMongoose.mongoose) {
		globalWithMongoose.mongoose = { conn: null, promise: null };
	}
	if (globalWithMongoose.mongoose.conn) {
		return globalWithMongoose.mongoose.conn;
	}

	if (!globalWithMongoose.mongoose.promise) {
		globalWithMongoose.mongoose.promise = mongoose.connect(
			MONGODB_CONNECTION as string,
			{
				bufferCommands: false,
			}
		);
	}

	globalWithMongoose.mongoose.conn = await globalWithMongoose.mongoose.promise;
	return globalWithMongoose.mongoose.conn;
}
