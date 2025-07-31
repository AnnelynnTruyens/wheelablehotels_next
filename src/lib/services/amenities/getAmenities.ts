"use server";

import AmenityModel from "@/lib/modules/Amenity/Amenity.model";
import { Amenity } from "@/lib/modules/Amenity/Amenity.types";
import { connectToDatabase } from "@/lib/mongoose";

export async function getAmenities(): Promise<Amenity[]> {
	try {
		await connectToDatabase();
		const amenities = await AmenityModel.find({});
		return amenities;
	} catch (error) {
		console.error("Error fetching amenities:", error);
		throw new Error("Failed to fetch amenities");
	}
}
