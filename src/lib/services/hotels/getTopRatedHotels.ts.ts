import Hotel from "@/lib/modules/Hotel/Hotel.model";
import Review from "@/lib/modules/Review/Review.model";
import { connectToDatabase } from "@/lib/mongoose";
import { HotelWithRating } from "./types";

// Get top-rated hotels
export async function getTopRatedHotels(): Promise<HotelWithRating[]> {
	await connectToDatabase();

	const hotels = await Hotel.find({ status: "completed" })
		.populate("amenities")
		.populate("accessibilityFeatures");

	const hotelsWithRatings: HotelWithRating[] = [];

	for (const hotel of hotels) {
		const reviews = await Review.find({ hotelId: hotel._id });
		if (!reviews.length) continue;

		const sum = reviews.reduce((acc, r) => acc + Number(r.rating ?? 0), 0);
		const avg = Number((sum / reviews.length).toFixed(1));

		hotelsWithRatings.push({
			_id: hotel._id.toString(),
			name: hotel.name,
			location: hotel.location,
			rating: avg,
			status: hotel.status,
			amenities: hotel.amenities.map((a: any) => ({
				_id: a._id.toString(),
				name: a.name,
			})),
			accessibilityFeatures: hotel.accessibilityFeatures.map((f: any) => ({
				_id: f._id.toString(),
				name: f.name,
			})),
		});
	}

	// Sort and take top 5
	return hotelsWithRatings
		.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
		.slice(0, 5);
}
