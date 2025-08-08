"use server";

import AuthError from "@/lib/middleware/errors/AuthError";
import { cookies } from "next/headers";
import { getCurrentUser } from "../users/getCurrentUser";
import NotFoundError from "@/lib/middleware/errors/NotFoundError";
import RoomModel from "@/lib/modules/Room/Room.model";
import { connectToDatabase } from "@/lib/mongoose";

export async function deleteRoom(id: string) {
	try {
		await connectToDatabase();

		const authToken = (await cookies()).get("authToken")?.value;
		if (!authToken) {
			throw new AuthError("Unauthorized", 401);
		}

		const headers = new Headers();
		headers.set("authorization", `Bearer ${authToken}`);
		const user = await getCurrentUser(headers);

		const room = await RoomModel.findOneAndDelete({
			_id: id,
			userId: user._id,
		});
		if (!room) {
			throw new NotFoundError("Room not found");
		}

		return;
	} catch (err) {
		if (err instanceof AuthError || err instanceof NotFoundError) {
			throw err;
		}
		throw new Error("Failed to delete favourite");
	}
}
