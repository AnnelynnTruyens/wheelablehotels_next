import { NextRequest, NextResponse } from "next/server";
import Hotel from "@/lib/modules/Hotel/Hotel.model";
import Review from "@/lib/modules/Review/Review.model";
import { handleApiError } from "@/lib/middleware/errors/handleApiError";
import { connectToDatabase } from "@/lib/mongoose";

async function calculateAverageRating(hotelId: string): Promise<number | null> {
	const reviews = await Review.find({ hotelId });
	if (!reviews.length) return null;

	const sum = reviews.reduce((acc, r) => acc + Number(r.rating ?? 0), 0);
	return Number((sum / reviews.length).toFixed(1));
}

export async function GET(req: NextRequest) {
	await connectToDatabase();
	try {
		const { searchParams } = new URL(req.url);
		const userId = searchParams.get("userId");

		const hotels = await Hotel.find({ ...(userId ? { userId } : {}) })
			.populate("amenities")
			.populate("accessibilityFeatures");

		const hotelsWithRatings = await Promise.all(
			hotels.map(async (hotel) => {
				const avgRating = await calculateAverageRating(hotel._id.toString());
				return {
					...hotel.toObject(),
					rating: avgRating,
				};
			})
		);

		return NextResponse.json(hotelsWithRatings);
	} catch (err: unknown) {
		if (err instanceof Error) {
			return handleApiError(err);
		} else {
			// Optional: handle unexpected non-Error throws
			return handleApiError(new Error("An unknown error occurred"));
		}
	}
}
