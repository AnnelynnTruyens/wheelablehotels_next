"use server";

import AuthError from "@/lib/middleware/errors/AuthError";
import { connectToDatabase } from "@/lib/mongoose";
import { cookies } from "next/headers";
import { getCurrentUser } from "./getCurrentUser";
import UserModel from "@/lib/modules/User/User.model";
import { UserInfo } from "./types";

export async function getAllUsers(): Promise<UserInfo[]> {
	await connectToDatabase();

	const authToken = (await cookies()).get("authToken")?.value;
	if (!authToken) {
		throw new AuthError("Unauthorized", 401);
	}

	const headers = new Headers();
	headers.set("authorization", `Bearer ${authToken}`);
	const user = await getCurrentUser(headers);

	if (user.role !== "admin") {
		throw new AuthError("Unauthorized", 401);
	}

	const users = await UserModel.find();

	const usersWithInfo: UserInfo[] = [];

	for (const user of users) {
		usersWithInfo.push({
			_id: user._id.toString(),
			username: user.username,
			email: user.email,
			role: user.role,
		});
	}

	return usersWithInfo;
}
