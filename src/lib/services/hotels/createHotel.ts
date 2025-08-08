"use server";

import AuthError from "@/lib/middleware/errors/AuthError";
import { cookies } from "next/headers";
import { getCurrentUser } from "../users/getCurrentUser";
import HotelModel from "@/lib/modules/Hotel/Hotel.model";
import slugify from "slugify";
import { connectToDatabase } from "@/lib/mongoose";

export async function createHotel(
	prevState: any,
	formData: FormData
): Promise<{
	success: boolean;
	data: { _id: string; name: string; slug: string; status: string } | null;
	error: string | null;
}> {
	try {
		await connectToDatabase();

		const authToken = (await cookies()).get("authToken")?.value;
		if (!authToken) {
			throw new AuthError("Unauthorized", 401);
		}

		const headers = new Headers();
		headers.set("authorization", `Bearer ${authToken}`);
		const user = await getCurrentUser(headers);

		const hotelName = formData.get("hotelName") as string;
		const hotelSlug =
			slugify(hotelName, { lower: true, strict: true }) + `-${user.username}`;

		const hotel = new HotelModel({
			name: hotelName,
			userId: user._id,
			slug: hotelSlug,
			status: "new",
			amenities: [],
			accessibilityFeatures: [],
		});

		await hotel.save();

		return {
			success: true,
			data: {
				_id: hotel._id.toString(),
				name: hotel.name,
				slug: hotel.slug,
				status: hotel.status,
			},
			error: null,
		};
	} catch (err) {
		let message = "Something went wrong";

		if (err instanceof Error) {
			message = err.message;
		} else if (typeof err === "string") {
			message = err;
		}

		return {
			success: false,
			data: null,
			error: message,
		};
	}
}
