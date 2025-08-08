"use server";

import AuthError from "@/lib/middleware/errors/AuthError";
import { cookies } from "next/headers";
import { getCurrentUser } from "../users/getCurrentUser";
import HotelModel from "@/lib/modules/Hotel/Hotel.model";
import NotFoundError from "@/lib/middleware/errors/NotFoundError";
import ImageModel from "@/lib/modules/Image/Image.model";
import { connectToDatabase } from "@/lib/mongoose";

export async function createImage({
	hotelId,
	name,
	alt,
	filename,
}: {
	hotelId: string;
	name: string;
	alt: string;
	filename: string;
}) {
	try {
		await connectToDatabase();

		const authToken = (await cookies()).get("authToken")?.value;
		if (!authToken) {
			throw new AuthError("Unauthorized", 401);
		}

		const headers = new Headers();
		headers.set("authorization", `Bearer ${authToken}`);
		const user = await getCurrentUser(headers);

		const hotel = hotelId ? HotelModel.findById(hotelId) : null;

		if (!hotel) {
			throw new NotFoundError("Hotel not found");
		}

		const image = new ImageModel({
			hotelId,
			userId: user._id,
			name,
			alt,
			imageUrl: filename,
		});

		await image.save();

		return { success: true };
	} catch (err) {
		if (err instanceof AuthError || err instanceof NotFoundError) {
			throw err;
		}
		throw new Error("Failed to create image");
	}
}
