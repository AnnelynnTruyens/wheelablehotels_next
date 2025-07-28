"use server";

import Image from "@/lib/modules/Image/Image.model";
import { connectToDatabase } from "@/lib/mongoose";

type GetImagesParams = {
	hotelId: string;
};

export async function getFirstImageByHotel({ hotelId }: GetImagesParams) {
	try {
		await connectToDatabase();

		const image = await Image.findOne({ hotelId })
			.select("imageUrl alt")
			.sort({ createdAt: 1 });

		return image;
	} catch (error) {
		console.error("Error in getFirstImageByHotel:", error);
		throw new Error("Failed to fetch first image");
	}
}
