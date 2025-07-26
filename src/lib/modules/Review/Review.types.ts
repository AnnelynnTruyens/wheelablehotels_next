import { ObjectId } from "mongoose";
import { User } from "../User/User.types";
import { Hotel } from "../Hotel/Hotel.types";

export type Review = Document & {
	_id?: string;
	message?: string;
	rating: Number;
	status: string;
	userId: ObjectId;
	user?: User;
	hotelId: ObjectId;
	hotel?: Hotel;
};
