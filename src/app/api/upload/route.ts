import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

// Multer must run outside API handler – need adapter
const uploadDir = path.join(process.cwd(), "public/uploads");
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
}

// You can't use multer directly in Next API routes, so use raw body parsing instead (or external server)
export async function POST(req: NextRequest) {
	// Needs to be handled via custom edge runtime or a dedicated server
	return NextResponse.json({
		message: "Use server-based uploader or next-connect",
	});
}
