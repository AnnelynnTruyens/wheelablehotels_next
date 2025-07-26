import { Document, ObjectId } from "mongoose";
import { User } from "../User/User.types";
import { Hotel } from "../Hotel/Hotel.types";

export type Favourite = Document & {
	_id?: string;
	hotelId: ObjectId;
	hotel?: Hotel;
	userId: ObjectId;
	user?: User;
};
