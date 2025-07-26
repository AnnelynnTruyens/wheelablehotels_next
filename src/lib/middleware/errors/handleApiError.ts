import AppError from "./AppError";
import { NextResponse } from "next/server";
import { Error as MongooseError } from "mongoose";

export function handleApiError(err: any) {
	if (err instanceof AppError) {
		return NextResponse.json(
			{ message: err.message },
			{ status: err.statusCode }
		);
	}

	if (err instanceof MongooseError.ValidationError) {
		return NextResponse.json(
			{ message: err.message, errors: err.errors },
			{ status: 400 }
		);
	}

	return NextResponse.json(
		{ message: "Internal Server Error" },
		{ status: 500 }
	);
}
