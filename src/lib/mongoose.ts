import mongoose, { Mongoose } from "mongoose";

const MONGODB_CONNECTION = process.env.MONGODB_CONNECTION;

if (!MONGODB_CONNECTION) {
	throw new Error("Please define the MONGODB_CONNECTION environment variable");
}

// Extend the NodeJS global type to include our mongoose cache
declare global {
	namespace NodeJS {
		interface Global {
			mongoose: {
				conn: Mongoose | null;
				promise: Promise<Mongoose> | null;
			};
		}
	}
}

// Use the declared type (no `as any`)
const globalWithMongoose = global as unknown as NodeJS.Global;

if (!globalWithMongoose.mongoose) {
	globalWithMongoose.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase(): Promise<Mongoose> {
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
