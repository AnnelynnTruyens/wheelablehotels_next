"use server";

import RoomModel from "@/lib/modules/Room/Room.model";
import { connectToDatabase } from "@/lib/mongoose";
import { Types } from "mongoose";
import { RoomInfo } from "./types";
import { AccessibilityFeature } from "@/lib/modules/AccessibilityFeature/AccessibilityFeature.types";
import "@/lib/modules/AccessibilityFeature/AccessibilityFeature.model";

export async function getRoomsByHotel(hotelId: string): Promise<RoomInfo[]> {
	try {
		await connectToDatabase();

		const query: Record<string, string | Types.ObjectId> = {};
		query.hotelId = hotelId;

		const rooms = await RoomModel.find(query).populate("accessibilityFeatures");
		const roomsInfo: RoomInfo[] = [];

		for (const room of rooms) {
			roomsInfo.push({
				_id: room._id.toString(),
				hotelId: room.hotelId.toString(),
				name: room.name,
				description: room.description,
				accessibilityInfo: room.accessibilityInfo,
				accessibilityFeatures: (
					room.accessibilityFeatures as AccessibilityFeature[]
				).map((f) => ({
					_id: f._id.toString(),
					name: f.name,
					icon: f.icon,
				})),
			});
		}

		return roomsInfo;
	} catch (error) {
		console.error("Error in getRooms:", error);
		throw new Error("Failed to fetch rooms");
	}
}
