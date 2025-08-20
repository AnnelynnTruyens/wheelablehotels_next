"use server";

import FavouriteModel from "@/lib/modules/Favourite/Favourite.model";
import { connectToDatabase } from "@/lib/mongoose";
import "@/lib/modules/Hotel/Hotel.model";
import { getCurrentUser } from "../users/getCurrentUser";
import { cookies } from "next/headers";
import AuthError from "@/lib/middleware/errors/AuthError";
import { HotelWithRatingSimple } from "../hotels/types";
import HotelModel from "@/lib/modules/Hotel/Hotel.model";
import NotFoundError from "@/lib/middleware/errors/NotFoundError";
import ReviewModel from "@/lib/modules/Review/Review.model";

export async function getFavouritesByUser(): Promise<HotelWithRatingSimple[]> {
	try {
		await connectToDatabase();

		const authToken = (await cookies()).get("authToken")?.value;
		if (!authToken) {
			throw new AuthError("Unauthorized", 401);
		}

		const headers = new Headers();
		headers.set("authorization", `Bearer ${authToken}`);
		const user = await getCurrentUser(headers);

		const favourites = await FavouriteModel.find({
			userId: user._id,
		});

		if (!favourites) {
			throw new NotFoundError("Favourites not found");
		}

		const favouritesWithHotels: HotelWithRatingSimple[] = [];

		for (const favourite of favourites) {
			const hotel = await HotelModel.findOne({ _id: favourite.hotelId });

			const reviews = await ReviewModel.find({ hotelId: favourite.hotelId });
			const sum = reviews.reduce((acc, r) => acc + Number(r.rating ?? 0), 0);
			const avg = Number((sum / reviews.length).toFixed(1));

			favouritesWithHotels.push({
				_id: hotel._id.toString(),
				name: hotel.name,
				slug: hotel.slug,
				address: hotel.address,
				location: hotel.location,
				rating: avg,
				status: hotel.status,
			});
		}
		return favouritesWithHotels;
	} catch (err) {
		if (err instanceof AuthError) {
			throw err;
		}
		throw new Error("Failed to fetch favourites");
	}
}
