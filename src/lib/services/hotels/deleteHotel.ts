"use server";

import AuthError from "@/lib/middleware/errors/AuthError";
import { connectToDatabase } from "@/lib/mongoose";
import { cookies } from "next/headers";
import { getCurrentUser } from "../users/getCurrentUser";
import HotelModel from "@/lib/modules/Hotel/Hotel.model";
import { getRoomsByHotel } from "../rooms/getRoomsByHotel";
import { getImagesByHotel } from "../images/getImagesByHotel";
import { deleteRoom } from "../rooms/deleteRoom";
import { deleteImage } from "../images/deleteImage";
import NotFoundError from "@/lib/middleware/errors/NotFoundError";
import { getFavouritesByHotel } from "../favourites/getFavouriteByHotel";
import { deleteFavourite } from "../favourites/deleteFavourite";

export async function deleteHotel(hotelId: string) {
	try {
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

		const rooms = await getRoomsByHotel(hotelId);
		const images = await getImagesByHotel(hotelId);
		const favourites = await getFavouritesByHotel(hotelId);

		if (rooms && rooms.length > 0) {
			for (const room of rooms) {
				deleteRoom(room._id);
			}
		}

		if (images && images.length > 0) {
			for (const image of images) {
				deleteImage(image._id);
			}
		}

		if (favourites && favourites.length > 0) {
			for (const favourite of favourites) {
				deleteFavourite(favourite._id);
			}
		}

		const hotel = await HotelModel.findOneAndDelete({
			_id: hotelId,
		});

		if (!hotel) {
			throw new NotFoundError("Hotel not found");
		}

		return { success: true };
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		} else {
			throw new Error("Hotel couldn't be deleted");
		}
	}
}
