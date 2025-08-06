"use server";

import AuthError from "@/lib/middleware/errors/AuthError";
import { cookies } from "next/headers";
import { getCurrentUser } from "../users/getCurrentUser";
import RoomModel from "@/lib/modules/Room/Room.model";
import NotFoundError from "@/lib/middleware/errors/NotFoundError";

export async function updateRoom(
	_prevState: any,
	formData: FormData,
	roomId: string
) {
	try {
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

		const query =
			user.role === "admin"
				? { _id: roomId }
				: { _id: roomId, userId: user._id };

		const updatedRoom = await RoomModel.findOneAndUpdate(
			query,
			{
				hotelId,
				name: roomName,
				description,
				accessibilityInfo,
				accessibilityFeatures,
			},
			{ new: true, runValidators: true }
		);

		if (!updatedRoom) {
			throw new NotFoundError("Room not found");
		}
		return;
	} catch (err) {
		if (err instanceof AuthError || err instanceof NotFoundError) {
			throw err;
		}
		throw new Error("Failed to update room");
	}
}
