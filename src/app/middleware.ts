import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
	const response = NextResponse.next();

	// Helmet-like headers
	response.headers.set("X-Content-Type-Options", "nosniff");
	response.headers.set("X-Powered-By", ""); // hide powered-by
	response.headers.set("X-XSS-Protection", "1; mode=block");

	return response;
}

// Apply middleware to all routes or define specific matchers
export const config = {
	matcher: ["/api/:path*"],
};
