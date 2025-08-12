"use server";

import AuthError from "@/lib/middleware/errors/AuthError";
import { connectToDatabase } from "@/lib/mongoose";
import { cookies } from "next/headers";
import { getCurrentUser } from "./getCurrentUser";
import UserModel from "@/lib/modules/User/User.model";
import NotFoundError from "@/lib/middleware/errors/NotFoundError";

export async function updateUser(id: string, role: string) {
	try {
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

		const updatedUser = await UserModel.findOneAndUpdate(
			{
				_id: id,
			},
			{ role: role }
		);

		if (!updatedUser) {
			throw new NotFoundError("User not found");
		}

		return { success: true };
	} catch (err) {
		if (err instanceof AuthError || err instanceof NotFoundError) {
			throw err;
		}
		throw new Error("Failed to update user");
	}
}
