import Hotel from "@/lib/modules/Hotel/Hotel.model";
import Review from "@/lib/modules/Review/Review.model";
import { connectToDatabase } from "@/lib/mongoose";

// Type for hotel data
interface HotelWithRating {
	_id: string;
	name: string;
	location?: string;
	rating: number;
	status: string;
}

// Get hotels
export async function getHotels(): Promise<HotelWithRating[]> {
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
		});
	}

	return hotelsWithRatings;
}

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
		});
	}

	// Sort and take top 5
	return hotelsWithRatings
		.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
		.slice(0, 5);
}
