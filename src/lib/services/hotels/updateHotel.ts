"use server";

import AuthError from "@/lib/middleware/errors/AuthError";
import NotFoundError from "@/lib/middleware/errors/NotFoundError";
import { cookies } from "next/headers";
import { getCurrentUser } from "../users/getCurrentUser";
import slugify from "slugify";
import HotelModel from "@/lib/modules/Hotel/Hotel.model";

export async function updateHotel(
	_prevState: any,
	formData: FormData,
	hotelId: string
): Promise<{
	success: boolean;
	data: { _id: string; slug: string; status: string } | null;
	error: string | null;
}> {
	try {
		const authToken = (await cookies()).get("authToken")?.value;
		if (!authToken) {
			throw new AuthError("Unauthorized", 401);
		}

		const headers = new Headers();
		headers.set("authorization", `Bearer ${authToken}`);
		const user = await getCurrentUser(headers);

		const hotelName = formData.get("hotelName") as string;
		const location = formData.get("location") as string;
		const contactEmail = formData.get("contactEmail") as string;
		const contactPhone = formData.get("contactPhone") as string;
		const website = formData.get("website") as string;
		const accessibilityInfo = formData.get("accessibilityInfo") as string;
		const status = formData.get("status") as string;

		const amenities = formData.getAll("amenities[]");
		const accessibilityFeatures = formData.getAll("accessibilityFeatures[]");

		const hotelSlug =
			slugify(hotelName, { lower: true, strict: true }) + `-${user.username}`;

		const query =
			user.role === "admin"
				? { _id: hotelId }
				: { _id: hotelId, userId: user._id };

		console.log("Running update with query:", query);
		console.log("Authenticated user:", user._id, "Role:", user.role);

		const updatedHotel = await HotelModel.findOneAndUpdate(
			query,
			{
				name: hotelName,
				location,
				contactEmail,
				contactPhone,
				website,
				accessibilityInfo,
				status,
				amenities,
				accessibilityFeatures,
				slug: hotelSlug,
			},
			{ new: true, runValidators: true }
		);

		if (!updatedHotel) {
			throw new NotFoundError("Hotel not found");
		}

		return {
			success: true,
			data: {
				_id: updatedHotel._id.toString(),
				slug: updatedHotel.slug,
				status: updatedHotel.status,
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
