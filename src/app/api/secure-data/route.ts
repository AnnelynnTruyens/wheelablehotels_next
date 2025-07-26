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
	} catch (err: any) {
		return NextResponse.json(
			{ message: err.message },
			{ status: err.statusCode ?? 500 }
		);
	}
}
