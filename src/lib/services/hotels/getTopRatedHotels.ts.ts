import Hotel from "@/lib/modules/Hotel/Hotel.model";
import Review from "@/lib/modules/Review/Review.model";
import { connectToDatabase } from "@/lib/mongoose";
import { HotelWithRatingSimple } from "./types";
import "@/lib/modules/Amenity/Amenity.model";
import "@/lib/modules/AccessibilityFeature/AccessibilityFeature.model";

// Get top-rated hotels
export async function getTopRatedHotels(): Promise<HotelWithRatingSimple[]> {
	await connectToDatabase();

	const hotels = await Hotel.find({ status: "published" });

	const hotelsWithRatings: HotelWithRatingSimple[] = [];

	for (const hotel of hotels) {
		const reviews = await Review.find({ hotelId: hotel._id });
		if (!reviews.length) continue;

		const sum = reviews.reduce((acc, r) => acc + Number(r.rating ?? 0), 0);
		const avg = Number((sum / reviews.length).toFixed(1));

		hotelsWithRatings.push({
			_id: hotel._id.toString(),
			name: hotel.name,
			slug: hotel.slug,
			address: hotel.address,
			location: {
				lat: hotel.location?.lat?.toString(),
				lng: hotel.location?.lng?.toString(),
			},
			rating: avg,
			status: hotel.status,
		});
	}

	// Sort and take top 5
	return hotelsWithRatings
		.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
		.slice(0, 5);
}
