import { NextRequest, NextResponse } from "next/server";
import Hotel from "@/lib/modules/Hotel/Hotel.model";
import Review from "@/lib/modules/Review/Review.model";
import NotFoundError from "@/lib/middleware/errors/NotFoundError";
import { handleApiError } from "@/lib/middleware/errors/handleApiError";
import AuthError from "@/lib/middleware/errors/AuthError";

import { getUserFromRequest } from "@/lib/middleware/auth";
import { connectToDatabase } from "@/lib/mongoose";

type RouteParams = {
	params: {
		id: string;
	};
};

export async function GET(req: NextRequest, context: unknown) {
	await connectToDatabase();

	const { params } = context as RouteParams;

	try {
		const hotel = await Hotel.findOne({ _id: params.id })
			.populate("amenities")
			.populate("accessibilityFeatures")
			.populate("userId", "username");

		if (!hotel) throw new NotFoundError("Hotel not found");

		const avgRating = await Review.aggregate([
			{ $match: { hotelId: hotel._id } },
			{ $group: { _id: null, avg: { $avg: "$rating" } } },
		]);

		return NextResponse.json({
			...hotel.toObject(),
			rating: avgRating[0]?.avg ?? null,
		});
	} catch (err: unknown) {
		if (err instanceof Error) {
			return handleApiError(err);
		}
		return handleApiError(new Error("Unknown error"));
	}
}

export async function PUT(req: NextRequest, context: RouteParams) {
	await connectToDatabase();
	try {
		const user = await getUserFromRequest(req);
		const body = await req.json();

		const query =
			user.role === "admin"
				? { _id: context.params.id }
				: { _id: context.params.id, userId: user._id };

		const hotel = await Hotel.findOneAndUpdate(query, body, {
			new: true,
			runValidators: true,
		});

		if (!hotel) throw new NotFoundError("Hotel not found");

		return NextResponse.json(hotel);
	} catch (err: unknown) {
		if (err instanceof Error) {
			return handleApiError(err);
		}
		return handleApiError(new Error("Unknown error"));
	}
}

export async function DELETE(req: NextRequest, context: RouteParams) {
	await connectToDatabase();
	try {
		const user = await getUserFromRequest(req);
		if (user.role !== "admin") throw new AuthError("Unauthorized", 401);

		const deleted = await Hotel.findOneAndDelete({ _id: context.params.id });
		if (!deleted) throw new NotFoundError("Hotel not found");

		return NextResponse.json({});
	} catch (err: unknown) {
		if (err instanceof Error) {
			return handleApiError(err);
		}
		return handleApiError(new Error("Unknown error"));
	}
}
