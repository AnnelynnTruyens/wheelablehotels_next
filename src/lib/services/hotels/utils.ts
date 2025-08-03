import ReviewModel from "@/lib/modules/Review/Review.model";
import { connectToDatabase } from "@/lib/mongoose";

export async function calculateAverageRating(hotelId: string) {
	await connectToDatabase();
	const reviews = await ReviewModel.find({ hotelId: hotelId });

	const sum = reviews.reduce((acc, r) => acc + Number(r.rating ?? 0), 0);
	return Number((sum / reviews.length).toFixed(1));
}
