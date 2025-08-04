import { connectToDatabase } from "@/lib/mongoose";
import { HotelWithRatingAndImage, HotelWithRatingSimple } from "./types";
import Hotel from "@/lib/modules/Hotel/Hotel.model";
import Review from "@/lib/modules/Review/Review.model";
import { Amenity } from "@/lib/modules/Amenity/Amenity.types";
import { AccessibilityFeature } from "@/lib/modules/AccessibilityFeature/AccessibilityFeature.types";
import { getFirstImageByHotel } from "../images/getFirstImage";
import "@/lib/modules/Amenity/Amenity.model";
import "@/lib/modules/AccessibilityFeature/AccessibilityFeature.model";

// Get hotels
export async function getHotelsByUser(
	userId: string
): Promise<HotelWithRatingSimple[]> {
	await connectToDatabase();

	const hotels = await Hotel.find({ status: "completed", userId: userId })
		.populate("amenities")
		.populate("accessibilityFeatures");

	const hotelsWithRatings: HotelWithRatingSimple[] = [];

	for (const hotel of hotels) {
		const reviews = await Review.find({ hotelId: hotel._id });

		const sum = reviews.reduce((acc, r) => acc + Number(r.rating ?? 0), 0);
		const avg = Number((sum / reviews.length).toFixed(1));

		hotelsWithRatings.push({
			_id: hotel._id.toString(),
			name: hotel.name,
			slug: hotel.slug,
			location: hotel.location,
			rating: avg,
			status: hotel.status,
		});
	}

	return hotelsWithRatings;
}
