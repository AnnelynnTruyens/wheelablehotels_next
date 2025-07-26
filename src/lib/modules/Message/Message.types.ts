import { Document, ObjectId } from "mongoose";

export type Message = Document & {
	_id?: string;
	name: string;
	email: string;
	message: string;
	hotelId?: ObjectId;
	status: string;
};
