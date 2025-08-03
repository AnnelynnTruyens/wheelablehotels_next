"use server";

import ReviewModel from "@/lib/modules/Review/Review.model";
import { connectToDatabase } from "@/lib/mongoose";
import { Types } from "mongoose";
import { ReviewInfo } from "./types";
import { User } from "@/lib/modules/User/User.types";

export async function getReviewsByHotel(
	hotelId: string
): Promise<ReviewInfo[]> {
	try {
		await connectToDatabase();
		const query: Record<string, string | Types.ObjectId> = {};
		query.hotelId = hotelId;

		const reviews = await ReviewModel.find(query).populate(
			"userId",
			"username"
		);

		const reviewsInfo: ReviewInfo[] = [];

		for (const review of reviews) {
			reviewsInfo.push({
				_id: review._id.toString(),
				message: review?.message || null,
				rating: review.rating,
				status: review.status,
				userId: {
					_id: (review.userId as User)._id?.toString(),
					username: (review.userId as User).username,
				},
			});
		}

		return reviewsInfo;
	} catch (error) {
		console.error("Error in getReviews:", error);
		throw new Error("Failed to fetch reviews");
	}
}
