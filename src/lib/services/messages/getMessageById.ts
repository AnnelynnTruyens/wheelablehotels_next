"use server";

import MessageModel from "@/lib/modules/Message/Message.model";
import { connectToDatabase } from "@/lib/mongoose";
import { MessageInfo } from "./types";
import { getHotelById } from "../hotels/getHotelById";

export async function getMessageById(id: string): Promise<MessageInfo> {
	await connectToDatabase();

	const message = await MessageModel.findOne({ _id: id });

	let hotel;
	if (message.hotelId) {
		hotel = await getHotelById(message.hotelId);
	}

	const messageWithInfo: MessageInfo = {
		_id: message._id.toString(),
		name: message.name,
		email: message.email,
		message: message.message,
		hotelId: message?.hotelId?.toString(),
		hotelName: hotel?.name,
		status: message.status,
	};

	return messageWithInfo;
}
