"use server";

import ImageModel from "@/lib/modules/Image/Image.model";
import { connectToDatabase } from "@/lib/mongoose";
import { Types } from "mongoose";
import { ImageInfo } from "./types";

export async function getImagesByHotel(hotelId: string): Promise<ImageInfo[]> {
	try {
		await connectToDatabase();

		const query: Record<string, string | Types.ObjectId> = {};
		query.hotelId = hotelId;

		const images = await ImageModel.find(query);
		const imagesInfo: ImageInfo[] = [];

		for (const image of images) {
			imagesInfo.push({
				_id: image._id.toString(),
				name: image.name,
				imageUrl: image.imageUrl,
				alt: image.alt,
			});
		}

		return imagesInfo;
	} catch (error) {
		console.error("Error in getImages:", error);
		throw new Error("Failed to fetch images");
	}
}
