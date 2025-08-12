"use server";

import { connectToDatabase } from "@/lib/mongoose";
import { cookies } from "next/headers";
import { getCurrentUser } from "../users/getCurrentUser";
import FavouriteModel from "@/lib/modules/Favourite/Favourite.model";
import { FavouriteInfo } from "./types";

export async function getFavouriteByHotel(hotelId: string) {
	await connectToDatabase();

	const authToken = (await cookies()).get("authToken")?.value;
	if (!authToken) {
		return;
	}

	const headers = new Headers();
	headers.set("authorization", `Bearer ${authToken}`);
	const user = await getCurrentUser(headers);

	const favourite = await FavouriteModel.findOne({
		userId: user._id.toString(),
		hotelId: hotelId,
	});

	if (!favourite) return;

	const favouriteInfo: FavouriteInfo = {
		_id: favourite._id.toString(),
		userId: favourite.userId.toString(),
		hotelId: favourite.hotelId.toString(),
	};

	return favouriteInfo;
}

export async function getFavouritesByHotel(hotelId: string) {
	await connectToDatabase();

	const favourites = await FavouriteModel.find({
		hotelId: hotelId,
	});

	if (!favourites) return;

	const favouritesInfo: FavouriteInfo[] = [];

	for (const favourite of favourites) {
		favouritesInfo.push({
			_id: favourite._id.toString(),
			userId: favourite.userId.toString(),
			hotelId: favourite.hotelId.toString(),
		});
	}

	return favouritesInfo;
}
