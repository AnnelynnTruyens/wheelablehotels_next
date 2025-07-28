"use server";

import Image from "@/lib/modules/Image/Image.model";
import { connectToDatabase } from "@/lib/mongoose";
import { Types } from "mongoose";

type GetImagesParams = {
	hotelId: string;
};

export async function getImagesByHotel({ hotelId }: GetImagesParams) {
	try {
		await connectToDatabase();

		const query: Record<string, string | Types.ObjectId> = {};
		query.hotelId = hotelId;

		const images = await Image.find(query);

		return images;
	} catch (error) {
		console.error("Error in getImages:", error);
		throw new Error("Failed to fetch images");
	}
}
