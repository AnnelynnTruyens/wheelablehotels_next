import { NextRequest, NextResponse } from "next/server";
import Hotel from "@/lib/modules/Hotel/Hotel.model";
import { getUserFromRequest } from "@/lib/middleware/auth";
import AuthError from "@/lib/middleware/errors/AuthError";
import { handleApiError } from "@/lib/middleware/errors/handleApiError";
import { connectToDatabase } from "@/lib/mongoose";

export async function POST(req: NextRequest) {
	await connectToDatabase();
	try {
		const user = await getUserFromRequest(req);
		const body = await req.json();

		const hotel = new Hotel({ ...body, userId: user._id });
		const result = await hotel.save();

		return NextResponse.json(result);
	} catch (err: any) {
		if (err.code === 11000) {
			return handleApiError(
				new AuthError(
					"It seems like someone already added this hotel. Try tweaking the name.",
					409
				)
			);
		}
		return handleApiError(err);
	}
}
