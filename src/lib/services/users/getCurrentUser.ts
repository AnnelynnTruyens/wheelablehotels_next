"use server";

import jwt from "jsonwebtoken";
import AuthError from "@/lib/middleware/errors/AuthError";
import UserModel from "@/lib/modules/User/User.model";

const jwtSecret = process.env.JWT_SECRET!;
if (!jwtSecret) throw new Error("JWT_SECRET is not defined.");

export async function getCurrentUser(headers: Headers) {
	const authHeader = headers.get("authorization");
	const token = authHeader?.split(" ")[1];

	if (!token) throw new AuthError("Missing token", 401);

	try {
		const decoded = jwt.verify(token, jwtSecret) as { _id: string };
		const user = await UserModel.findById(decoded._id);
		if (!user) throw new AuthError("User not found", 401);
		return user;
	} catch {
		throw new AuthError("Invalid or expired token", 401);
	}
}
