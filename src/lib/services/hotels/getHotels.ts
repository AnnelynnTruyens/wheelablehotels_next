"use server";

import { connectToDatabase } from "@/lib/mongoose";
import { HotelWithRatingAndImage } from "./types";
import Hotel from "@/lib/modules/Hotel/Hotel.model";
import Review from "@/lib/modules/Review/Review.model";
import { Amenity } from "@/lib/modules/Amenity/Amenity.types";
import { AccessibilityFeature } from "@/lib/modules/AccessibilityFeature/AccessibilityFeature.types";
import { getFirstImageByHotel } from "../images/getFirstImage";
import "@/lib/modules/Amenity/Amenity.model";
import "@/lib/modules/AccessibilityFeature/AccessibilityFeature.model";

// Get hotels
export async function getHotels(): Promise<HotelWithRatingAndImage[]> {
	await connectToDatabase();

	const hotels = await Hotel.find({ status: "published" })
		.populate("amenities")
		.populate("accessibilityFeatures");

	const hotelsWithRatingsAndImage: HotelWithRatingAndImage[] = [];

	for (const hotel of hotels) {
		const reviews = await Review.find({ hotelId: hotel._id });

		const sum = reviews.reduce((acc, r) => acc + Number(r.rating ?? 0), 0);
		const avg = Number((sum / reviews.length).toFixed(1));

		const image = await getFirstImageByHotel({ hotelId: hotel._id });

		hotelsWithRatingsAndImage.push({
			_id: hotel._id.toString(),
			name: hotel.name,
			slug: hotel.slug,
			location: hotel.location,
			rating: avg,
			status: hotel.status,
			amenities: (hotel.amenities as Amenity[]).map((a) => ({
				_id: a._id.toString(),
				name: a.name,
			})),
			accessibilityFeatures: (
				hotel.accessibilityFeatures as AccessibilityFeature[]
			).map((f) => ({
				_id: f._id.toString(),
				name: f.name,
			})),
			imageUrl: image?.imageUrl || null,
			imageAlt: image?.alt || null,
		});
	}

	return hotelsWithRatingsAndImage;
}
