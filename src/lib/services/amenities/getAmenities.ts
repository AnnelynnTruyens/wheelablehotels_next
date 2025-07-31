"use server";

import AmenityModel from "@/lib/modules/Amenity/Amenity.model";
import { connectToDatabase } from "@/lib/mongoose";

export type SerializableAmenity = {
	_id: string;
	name: string;
	icon?: string;
};

export async function getAmenities(): Promise<SerializableAmenity[]> {
	await connectToDatabase();
	const amenities = await AmenityModel.find({});

	return amenities.map((a) => ({
		_id: a._id.toString(),
		name: a.name,
		icon: a.icon || null,
	}));
}
