"use server";

import AuthError from "@/lib/middleware/errors/AuthError";
import { connectToDatabase } from "@/lib/mongoose";
import { cookies } from "next/headers";
import { getCurrentUser } from "./getCurrentUser";
import { UserInfo } from "./types";
import NotFoundError from "@/lib/middleware/errors/NotFoundError";

export async function getCurrentUserInfo(): Promise<UserInfo> {
	await connectToDatabase();
	const authToken = (await cookies()).get("authToken")?.value;
	if (!authToken) {
		throw new AuthError("Unauthorized", 401);
	}

	const headers = new Headers();
	headers.set("authorization", `Bearer ${authToken}`);
	const user = await getCurrentUser(headers);

	if (!user._id) {
		throw new NotFoundError("User not found");
	}
	const userInfo: UserInfo = {
		_id: user._id,
		username: user.username,
		role: user.role,
	};

	return userInfo;
}
