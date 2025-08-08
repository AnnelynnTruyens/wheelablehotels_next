"use server";

import { connectToDatabase } from "@/lib/mongoose";
import { HotelWithRating } from "./types";
import HotelModel from "@/lib/modules/Hotel/Hotel.model";
import ReviewModel from "@/lib/modules/Review/Review.model";
import { User } from "../users/types";
import { Amenity } from "../amenities/types";
import { AccessibilityFeature } from "../accessibilityFeatures/types";
import { cookies } from "next/headers";
import AuthError from "@/lib/middleware/errors/AuthError";
import { getCurrentUser } from "../users/getCurrentUser";

export async function getAllHotels(): Promise<HotelWithRating[]> {
	await connectToDatabase();

	const authToken = (await cookies()).get("authToken")?.value;
	if (!authToken) {
		throw new AuthError("Unauthorized", 401);
	}

	const headers = new Headers();
	headers.set("authorization", `Bearer ${authToken}`);
	const user = await getCurrentUser(headers);

	if (user.role !== "admin") {
		throw new AuthError("Unauthorized", 401);
	}

	const hotels = await HotelModel.find()
		.populate("amenities")
		.populate("accessibilityFeatures")
		.populate("userId", "username");

	const hotelsWithRatings: HotelWithRating[] = [];

	for (const hotel of hotels) {
		const reviews = await ReviewModel.find({ hotelId: hotel._id });

		const sum = reviews.reduce((acc, r) => acc + Number(r.rating ?? 0), 0);
		const avg = Number((sum / reviews.length).toFixed(1));

		hotelsWithRatings.push({
			_id: hotel._id.toString(),
			name: hotel.name,
			slug: hotel.slug,
			location: hotel.location,
			rating: avg,
			userId: {
				_id: (hotel.userId as User)._id?.toString(),
				username: (hotel.userId as User).username,
			},
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
		});
	}

	return hotelsWithRatings;
}
