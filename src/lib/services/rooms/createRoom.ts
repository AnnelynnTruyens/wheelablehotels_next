"use server";

import AuthError from "@/lib/middleware/errors/AuthError";
import { getCurrentUser } from "../users/getCurrentUser";
import { cookies } from "next/headers";
import RoomModel from "@/lib/modules/Room/Room.model";
import HotelModel from "@/lib/modules/Hotel/Hotel.model";
import NotFoundError from "@/lib/middleware/errors/NotFoundError";
import { connectToDatabase } from "@/lib/mongoose";

export async function createRoom(formData: FormData) {
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
		const roomName = formData.get("name") as string;
		const description = formData.get("description") as string;
		const accessibilityInfo = formData.get("accessibilityInfo") as string;
		const accessibilityFeatures = formData.getAll("accessibilityFeatures[]");

		const hotel = hotelId ? HotelModel.findById(hotelId) : null;
		if (!hotel) {
			throw new NotFoundError("Hotel not found");
		}

		const room = new RoomModel({
			hotelId,
			userId: user._id,
			name: roomName,
			description,
			accessibilityInfo,
			accessibilityFeatures,
		});

		await room.save();

		return { success: true };
	} catch (err) {
		if (err instanceof AuthError || err instanceof NotFoundError) {
			throw err;
		}
		throw new Error("Failed to create room");
	}
}
