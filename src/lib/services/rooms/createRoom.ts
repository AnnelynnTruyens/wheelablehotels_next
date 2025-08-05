"use server";

import AuthError from "@/lib/middleware/errors/AuthError";
import { getCurrentUser } from "../users/getCurrentUser";
import { cookies } from "next/headers";
import RoomModel from "@/lib/modules/Room/Room.model";

export async function createRoom(formData: FormData) {
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

		console.log("FORM DATA", {
			hotelId,
			roomName,
			description,
			accessibilityInfo,
			accessibilityFeatures,
		});

		if (!hotelId) {
			return { error: true, message: "No hotelId" };
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
		if (err instanceof AuthError) {
			throw err;
		}
		throw new Error("Failed to create room");
	}
}
