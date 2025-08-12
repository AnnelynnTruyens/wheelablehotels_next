"use server";

import AuthError from "@/lib/middleware/errors/AuthError";
import { connectToDatabase } from "@/lib/mongoose";
import { cookies } from "next/headers";
import { getCurrentUser } from "../users/getCurrentUser";
import NotFoundError from "@/lib/middleware/errors/NotFoundError";
import UserModel from "@/lib/modules/User/User.model";

export async function deleteUser(id: string) {
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

	const userToDelete = await UserModel.findOneAndDelete({
		_id: id,
	});

	if (!userToDelete) {
		throw new NotFoundError("User not found");
	}

	return { success: true };
}
