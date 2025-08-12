"use server";

import { connectToDatabase } from "@/lib/mongoose";
import { MessageInfo } from "./types";
import { cookies } from "next/headers";
import AuthError from "@/lib/middleware/errors/AuthError";
import { getCurrentUser } from "../users/getCurrentUser";
import MessageModel from "@/lib/modules/Message/Message.model";
import { getHotelById } from "../hotels/getHotelById";

export async function getMessages(): Promise<MessageInfo[]> {
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

	const messages = await MessageModel.find();

	const messagesWithInfo: MessageInfo[] = [];

	for (const message of messages) {
		let hotel;
		if (message.hotelId) {
			hotel = await getHotelById(message.hotelId);
		}
		messagesWithInfo.push({
			_id: message._id.toString(),
			name: message.name,
			email: message.email,
			message: message.message,
			hotelId: message?.hotelId?.toString(),
			hotelName: hotel?.name,
			status: message.status,
		});
	}

	return messagesWithInfo;
}
