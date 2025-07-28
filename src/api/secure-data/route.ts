import { NextRequest, NextResponse } from "next/server";
import { verifyJwtToken } from "@/lib/middleware/auth";

export async function GET(req: NextRequest) {
	const authHeader = req.headers.get("authorization");
	const token = authHeader?.split(" ")[1];

	if (!token) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	try {
		const user = await verifyJwtToken(token);
		return NextResponse.json({ user });
	} catch (err: unknown) {
		if (
			typeof err === "object" &&
			err !== null &&
			"message" in err &&
			"statusCode" in err
		) {
			const { message, statusCode } = err as {
				message: string;
				statusCode?: number;
			};
			return NextResponse.json({ message }, { status: statusCode ?? 500 });
		}

		// Fallback for truly unknown errors
		return NextResponse.json(
			{ message: "An unknown error occurred" },
			{ status: 500 }
		);
	}
}
