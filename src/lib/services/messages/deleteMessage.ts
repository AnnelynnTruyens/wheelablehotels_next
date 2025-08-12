"use server";

import AuthError from "@/lib/middleware/errors/AuthError";
import { connectToDatabase } from "@/lib/mongoose";
import { cookies } from "next/headers";
import { getCurrentUser } from "../users/getCurrentUser";
import MessageModel from "@/lib/modules/Message/Message.model";
import NotFoundError from "@/lib/middleware/errors/NotFoundError";

export async function deleteMessage(id: string) {
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

	const message = await MessageModel.findOneAndDelete({ _id: id });
	if (!message) {
		throw new NotFoundError("Message not found");
	}

	return { success: true };
}
