import { Document, ObjectId } from "mongoose";

export type Image = Document & {
	_id?: string;
	name: string;
	imageUrl: string;
	alt: string;
	hotelId?: ObjectId;
	roomId?: ObjectId;
	userId: ObjectId;
};
