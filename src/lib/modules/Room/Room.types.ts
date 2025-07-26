import { Document, ObjectId } from "mongoose";
import { Hotel } from "../Hotel/Hotel.types";

export type Room = Document & {
	_id?: string;
	name: string;
	description: string;
	accessibilityInfo: string;
	userId: ObjectId;
	hotelId: ObjectId;
	hotel?: Hotel;
	accessibilityFeatures?: ObjectId[];
};
