import mongoose from "mongoose";

const MONGODB_CONNECTION = process.env.MONGODB_CONNECTION;

if (!MONGODB_CONNECTION) {
	throw new Error("Please define the MONGODB_CONNECTION environment variable");
}

let cached = (global as any).mongoose;

if (!cached) {
	cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
	if (cached.conn) return cached.conn;

	if (!cached.promise && MONGODB_CONNECTION) {
		cached.promise = mongoose
			.connect(MONGODB_CONNECTION, {
				bufferCommands: false,
			})
			.then((mongoose) => mongoose);
	}

	cached.conn = await cached.promise;
	return cached.conn;
}
