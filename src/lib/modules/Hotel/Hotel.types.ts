import { Document, ObjectId } from "mongoose";

export type Hotel = Document & {
	_id?: string;
	name: string;
	location?: string;
	contactEmail?: string;
	contactPhone?: string;
	website?: string;
	accessibilityInfo?: string;
	rating?: number;
	userId: ObjectId;
	status: string;
	amenities?: ObjectId[];
	accessibilityFeatures?: ObjectId[];
};
