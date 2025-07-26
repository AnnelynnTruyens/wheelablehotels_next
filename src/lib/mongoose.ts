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
			.then((mongoose) => {
				// ✅ Register all models once here
				require("./modules/AccessibilityFeature/AccessibilityFeature.model");
				require("./modules/Amenity/Amenity.model");
				require("./modules/Favourite/Favourite.model");
				require("./modules/Hotel/Hotel.model");
				require("./modules/Image/Image.model");
				require("./modules/Message/Message.model");
				require("./modules/Review/Review.model");
				require("./modules/Room/Room.model");
				require("./modules/User/User.model");
				return mongoose;
			});
	}

	cached.conn = await cached.promise;
	return cached.conn;
}
