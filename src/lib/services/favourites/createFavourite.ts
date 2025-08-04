"use server";

import { cookies } from "next/headers";
import { getCurrentUser } from "../users/getCurrentUser";
import AuthError from "@/lib/middleware/errors/AuthError";
import FavouriteModel from "@/lib/modules/Favourite/Favourite.model";

export async function createFavourite(formData: FormData) {
	try {
		const authToken = (await cookies()).get("authToken")?.value;
		if (!authToken) {
			throw new AuthError("Unauthorized", 401);
		}

		const headers = new Headers();
		headers.set("authorization", `Bearer ${authToken}`);
		const user = await getCurrentUser(headers);

		const hotelId = formData.get("hotelId") as string;

		const exists = await FavouriteModel.findOne({
			hotelId,
			userId: user._id,
		});

		if (exists) {
			return {
				_id: exists._id.toString(),
				message: "Already favourited",
			};
		}

		const favourite = new FavouriteModel({
			hotelId,
			userId: user._id,
		});

		await favourite.save();

		return {
			_id: favourite._id.toString(),
			hotelId: favourite.hotelId.toString(),
			userId: favourite.userId.toString(),
		};
	} catch (err) {
		if (err instanceof AuthError) {
			throw err;
		}
		throw new Error("Failed to create favourite");
	}
}
