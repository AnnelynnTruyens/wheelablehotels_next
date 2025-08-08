"use server";

import Review from "@/lib/modules/Review/Review.model";
import HotelModel from "@/lib/modules/Hotel/Hotel.model";
import AuthError from "@/lib/middleware/errors/AuthError";
import { getCurrentUser } from "../users/getCurrentUser";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/mongoose";

export async function createReview(formData: FormData) {
	try {
		await connectToDatabase();

		const authToken = (await cookies()).get("authToken")?.value;
		if (!authToken) {
			throw new AuthError("Unauthorized", 401);
		}

		const headers = new Headers();
		headers.set("authorization", `Bearer ${authToken}`);
		const user = await getCurrentUser(headers);

		const hotelId = formData.get("hotelId") as string;
		const rating = Number(formData.get("rating"));
		const message = formData.get("message") as string;

		if (!hotelId || isNaN(rating)) {
			return { error: true, message: "Invalid input" };
		}

		const review = new Review({
			hotelId,
			userId: user._id,
			rating,
			message,
			status: "new",
		});

		await review.save();

		// Recalculate average rating
		const reviews = await Review.find({ hotelId: hotelId });
		const averageRating = Number(
			(
				reviews.reduce((acc, r) => acc + Number(r.rating ?? 0), 0) /
				reviews.length
			).toFixed(1)
		);

		await HotelModel.findByIdAndUpdate(hotelId, {
			rating: averageRating,
		});

		return { success: true };
	} catch (err) {
		if (err instanceof AuthError) {
			throw err;
		}
		throw new Error("Failed to create review");
	}
}
