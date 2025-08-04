import Hotel from "@/lib/modules/Hotel/Hotel.model";
import Review from "@/lib/modules/Review/Review.model";
import { connectToDatabase } from "@/lib/mongoose";
import { HotelWithRatingAndImage } from "./types";
import { Amenity } from "@/lib/modules/Amenity/Amenity.types";
import { AccessibilityFeature } from "@/lib/modules/AccessibilityFeature/AccessibilityFeature.types";
import { getFirstImageByHotel } from "../images/getFirstImage";
import "@/lib/modules/Amenity/Amenity.model";
import "@/lib/modules/AccessibilityFeature/AccessibilityFeature.model";

// Get top-rated hotels
export async function getTopRatedHotels(): Promise<HotelWithRatingAndImage[]> {
	await connectToDatabase();

	const hotels = await Hotel.find({ status: "completed" })
		.populate("amenities")
		.populate("accessibilityFeatures");

	const hotelsWithRatings: HotelWithRatingAndImage[] = [];

	for (const hotel of hotels) {
		const reviews = await Review.find({ hotelId: hotel._id });
		if (!reviews.length) continue;

		const sum = reviews.reduce((acc, r) => acc + Number(r.rating ?? 0), 0);
		const avg = Number((sum / reviews.length).toFixed(1));

		const image = await getFirstImageByHotel({ hotelId: hotel._id });

		hotelsWithRatings.push({
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

	// Sort and take top 5
	return hotelsWithRatings
		.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
		.slice(0, 5);
}
