import { Document } from "mongoose";

export type Amenity = Document & {
	_id?: string;
	name: string;
	icon?: string;
};
